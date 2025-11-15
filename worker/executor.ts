import domain_to_pricing_map, { domain_validator } from '#pricing/index.ts'
import pipeline, { Result } from '#lib/effecty_middleware.ts'
import { route } from '#lib/effecty_router.ts'
import { send_email } from '#lib/resend.ts'
import type { FinancialNumber } from 'financial-number'
import * as jv from '#lib/json_validator.ts'
import { Validator } from '#lib/json_validator.ts'

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

const handle_request = async (request: Request, env: Env) => {
	const initial_context = {request, env, url: new URL(request.url)}

	return pipeline(
		initial_context,
		async (context) => {
			const origin = context.request.headers.get('Origin')
			if (!origin) {
				return Result.failure(error_response({ message: 'Missing Origin header' }))
			}

			return Result.success({...context, origin, domain: new URL(origin).hostname})
		},
		(context) => {
			const domain = new URL(context.origin).hostname

			if (!domain_validator.is_valid(domain)) {
				return Result.failure(error_response({ message: `Invalid domain: ${domain}` }))
			}

			const domain_services = domain_to_pricing_map[domain]

			return Result.success({...context, domain, domain_services})
		},
		context => {
			if (context.request.method === 'OPTIONS') {
				return Result.interrupt(response({ status: 204 }))
			}

			return Result.success(context)
		},
		context => {
			try {
				const body = await request.json()

				return Result.success({...context, body})
			} catch (e) {
				return Result.failure(error_response({ message: 'Invalid JSON' }))
			}
		},
		context => {
			return route({
				'/send_email': {
					'POST': ({body, ...context}) => {
						if (!body_validator.is_valid(body)) {
							return Result.failure(error_response({ message: body_validator.get_messages(body, 'body').join(', ') }))
						}
						const {service, args: pricing_args, contact} = body

						if (!context.domain_services.service_name_validator.is_valid(service)) {
							return Result.failure(error_response({ message: 'Invalid service name: ' + context.domain_services.service_name_validator.get_messages(service, 'body.service').join(', ') }))
						}

						const {validator} = context.domain_services.services[service]

						if (!validator.is_valid(pricing_args)) {
							return Result.failure(error_response({ message: 'Invalid pricing function arguments: ' + validator.get_messages(body.args, 'body.args').join(', ') }))
						}

						const pricing = context.domain_services.services[service].pricing as (args: any) => FinancialNumber

						const price = pricing(pricing_args)

						if (!valid)

						return Result.success({...context, service_pricing, body	})
					}
				}
			}, context.url.pathname, context.request.method, context)
		}
		(context) => Result.success(new Response('Success!', { status: 200 })),
	)
}

const is_anything: Validator<any> = {
	is_valid: (input: unknown): input is any => true,
	get_messages: (input: unknown, name: string) => [],
}

const body_validator = jv.object({
	service: jv.is_string,
	args: jv.object_values(is_anything),
	contact: jv.object({
		name: jv.is_string,
		email: jv.is_string,
		phone: jv.is_string,
		street_address: jv.is_string,
		extra: jv.object_values(jv.is_string),
	}),
})

const send_estimate_email = async (env: Pick<Env, 'RESEND_API_KEY'>, price: FinancialNumber, domain: string, company_name: string, service_name: string, contact: { name: string, email: string, phone: string, street_address: string }, args: Record<string, unknown>) => {
	return send_email({
		api_key: env.RESEND_API_KEY,
		from: 'Instant Estimate Central <noreply@instantestimatecentral.com>',
		to: ['josh@joshduff.com'],
		subject: `New ${service} estimate request from ${domain}`,
		html: `
			<h2>New Estimate Request</h2>
			<p><strong>Service:</strong> ${service}</p>
			<p><strong>Domain:</strong> ${domain}</p>
			<p><strong>Estimated Price:</strong> $${price.toString(2)}</p>
			<p><strong>Contact Information:</strong> ${contact.name} ${contact.email} ${contact.phone} ${contact.street_address}</p>
			<p><strong>Service Details:</strong> ${JSON.stringify(args, null, 2)}</p>
		`,
		reply_to: contact.email,
	})
}

export const handle_request_old = async (request: Request, env: Env): Promise<Response> => {
	return Effect.runPromise(pipe(
		Effect.succeed({request, env, url: new URL(request.url)}),
		Effect.flatMap(validate_origin),
		Effect.flatMap(validate_domain),
		Effect.flatMap((arg) => {
			const {request, env, url, origin, domain} = arg
			return Effect.succeed(new Response(request.body ?? null))
		}
	))

	if (url.pathname === '/send_email' && request.method === 'POST') {

		const { service, args, contact } = body

		const domain_services = domain_to_pricing_map[domain]

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
