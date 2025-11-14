import domain_to_pricing_map, { domain_validator } from '#pricing/index.ts'
import { send_email } from '#lib/resend.ts'
import type { FinancialNumber } from 'financial-number'

interface Env {
	RESEND_API_KEY: string
}

const cors_headers = {
	'Access-Control-Allow-Origin': 'https://embed.instantestimatecentral.com',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
}

const response = ({ body = null, status, headers = {} }: { body?: string | null, status: number, headers?: Record<string, string> }) => new Response(body, {
	status,
	headers: { ...cors_headers, ...headers },
})

const json_response = ({ body, status, headers = {} }: { body: any, status: number, headers?: Record<string, string> }) => response({
	body: JSON.stringify(body),
	status,
	headers: { 'Content-Type': 'application/json', ...headers }
})

const error_response = ({ message, status = 400, headers = {} }: { message: string, status?: number, headers?: Record<string, string> }) => json_response({
	body: { error: message },
	status,
	headers,
})

export const handle_request = async (request: Request, env: Env): Promise<Response> => {
	const url = new URL(request.url)

	if (request.method === 'OPTIONS') {
		return response({
			status: 204,
		})
	}

	if (url.pathname === '/send_email' && request.method === 'POST') {
		const origin = request.headers.get('Origin')
		if (!origin) {
			return error_response({ message: 'Missing Origin header' })
		}

		const domain = new URL(origin).hostname

		if (!domain_validator.is_valid(domain)) {
			return error_response({ message: `Invalid domain: ${domain}` })
		}

		let body: any
		try {
			body = await request.json()
		} catch (e) {
			return error_response({ message: 'Invalid JSON' })
		}

		const { service, args, contact } = body

		const domain_services = domain_to_pricing_map[domain]

		if (!domain_services.service_name_validator.is_valid(service)) {
			return error_response({ message: 'Missing or invalid service' })
		}

		const service_pricing = domain_services.services[service]

		if (!service_pricing.validator.is_valid(args)) {
			return error_response({ message: 'Invalid pricing function arguments: ' + service_pricing.validator.get_messages(args, 'args').join(', ') })
		}

		const price = (service_pricing.pricing as (args: any) => FinancialNumber)(args)

		try {
			const email_result = await send_email({
				api_key: env.RESEND_API_KEY,
				from: 'Instant Estimate Central <noreply@instantestimatecentral.com>',
				to: ['josh@joshduff.com'],
				subject: `New ${service} estimate request from ${domain}`,
				html: `
					<h2>New Estimate Request</h2>
					<p><strong>Service:</strong> ${service}</p>
					<p><strong>Domain:</strong> ${domain}</p>
					<p><strong>Estimated Price:</strong> $${price.toString(2)}</p>

					<h3>Contact Information</h3>
					<p><strong>Name:</strong> ${contact.name}</p>
					<p><strong>Email:</strong> ${contact.email}</p>
					<p><strong>Phone:</strong> ${contact.phone}</p>
					<p><strong>Address:</strong> ${contact.street_address}</p>

					<h3>Service Details</h3>
					<pre>${JSON.stringify(args, null, 2)}</pre>
				`,
				reply_to: contact.email,
			})

			return json_response({
				body: { success: true, email_id: email_result.id },
				status: 200,
			})
		} catch (error) {
			console.error('Email sending error:', error)
			return error_response({
				message: 'Failed to send email',
				status: 500,
			})
		}
	}

	return response({
		body: 'Not Found',
		status: 404,
	})
}
