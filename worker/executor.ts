import pricing_map from '../pricing/index.ts'
import { send_email } from '../lib/resend.ts'
import type { FinancialNumber } from 'financial-number'

interface Env {
	RESEND_API_KEY: string
}

const cors_headers = {
	'Access-Control-Allow-Origin': 'https://embed.instantestimatecentral.com',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
}

export const handle_request = async (request: Request, env: Env): Promise<Response> => {
	const url = new URL(request.url)

	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: cors_headers,
		})
	}

	if (url.pathname === '/send_email' && request.method === 'POST') {
		const origin = request.headers.get('Origin')
		if (!origin) {
			return new Response(JSON.stringify({ error: 'Missing Origin header' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
		}

		const domain = new URL(origin).hostname

		const domain_pricing = pricing_map[domain as keyof typeof pricing_map]
		if (!domain_pricing) {
			return new Response(JSON.stringify({ error: `Unknown domain: ${domain}` }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
		}

		let body: any
		try {
			body = await request.json()
		} catch (e) {
			return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
		}

		const { service, args, contact } = body

		if (typeof service !== 'string') {
			return new Response(JSON.stringify({ error: 'Missing or invalid service' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
		}

		const service_pricing = domain_pricing[service as keyof typeof domain_pricing]
		if (!service_pricing) {
			return new Response(JSON.stringify({ error: `Unknown service: ${service}` }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
		}

		const validator = service_pricing.validator as { is_valid: (input: unknown) => boolean; get_messages: (input: unknown, name: string) => string[] }
		const is_valid = validator.is_valid(args)
		if (!is_valid) {
			const messages = validator.get_messages(args, 'args')
			return new Response(JSON.stringify({ error: 'Invalid args', messages }), {
				status: 400,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
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

			return new Response(JSON.stringify({ success: true, email_id: email_result.id }), {
				status: 200,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
		} catch (error) {
			console.error('Email sending error:', error)
			return new Response(JSON.stringify({ error: 'Failed to send email' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...cors_headers },
			})
		}
	}

	return new Response('Not Found', {
		status: 404,
		headers: cors_headers,
	})
}
