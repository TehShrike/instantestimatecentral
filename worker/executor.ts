import domain_to_company_map, { domain_validator } from '#pricing/index.ts'
import pipeline, { Result } from './effecty_middleware.ts'
import { route } from './effecty_router.ts'
import { send_email } from '#lib/resend.ts'
import * as jv from '#lib/json_validator.ts'
import { Validator } from '#lib/json_validator.ts'
import { response, json_response, error_response } from './response_helpers.ts'
import type { Env } from './environment.ts'

const handle_request = async (request: Request, env: Env): Promise<Result<Response, Response | { message: string, stack?: string | null }, Response>> => {
	const initial_context = {request, env, url: new URL(request.url)}

	console.log('Handling request, method:', request.method, 'url:', request.url)

	return pipeline(
		initial_context,
		async (context) => {
			const request_origin = context.request.headers.get('Origin')
			if (!request_origin) {
				console.warn('Missing Origin header')
				return Result.failure(error_response({ message: 'Missing Origin header' }))
			}

			const domain = new URL(request_origin).hostname

			if (!domain_validator.is_valid(domain)) {
				console.warn('Invalid domain:', domain)
				return Result.failure(error_response({ message: `Invalid domain: ${domain}` }))
			}

			const company = domain_to_company_map[domain]

			return Result.success({...context, company })
		},
		context => {
			if (context.request.method === 'OPTIONS') {
				return Result.interrupt(response({ status: 204 }))
			}

			return Result.success(context)
		},
		async context => {
			try {
				const body = await request.json()

				return Result.success({...context, body})
			} catch (e) {
				return Result.failure(error_response({ message: 'Invalid JSON' }))
			}
		},
		context => {
			return route({
				'/send_estimate_email': {
					'POST': async ({body, company, ...context}) => {
						if (!body_validator.is_valid(body)) {
							return Result.failure(error_response({ message: body_validator.get_messages(body, 'body').join(', ') }))
						}
						const {service: service_name, args: pricing_args, contact} = body

						if (!company.service_name_validator.is_valid(service_name)) {
							return Result.failure(error_response({ message: 'Invalid service name: ' + company.service_name_validator.get_messages(service_name, 'body.service').join(', ') }))
						}

						const service = company.services[service_name as keyof typeof company.services]

						if (!service.validator.is_valid(pricing_args)) {
							return Result.failure(error_response({ message: 'Invalid pricing function arguments: ' + service.validator.get_messages(body.args, 'body.args').join(', ') }))
						}

						if (!company.contact_validator.is_valid(contact)) {
							return Result.failure(error_response({ message: 'Invalid contact: ' + company.contact_validator.get_messages(contact, 'body.contact').join(', ') }))
						}

						const price = service.pricing(pricing_args as any)

						const subject = company.render_subject(service, price)
						const html = company.render_html({
							service: service,
							contact: contact as any,
							price: price,
							estimate_arguments: pricing_args as any
						})


						const to = contact.email.toLowerCase() === 'me+iectest@joshduff.com'
							? 'josh@instantestimatecentral.com'
							: company.recipient_email_address

						await send_email({
							api_key: context.env.RESEND_API_KEY,
							from: 'Instant Estimate Central <estimate@estimate.instantestimatecentral.com>',
							reply_to: `Josh <josh@instantestimatecentral.com>`,
							to,
							subject,
							html,
						})

						return Result.success(json_response({ body: { success: true }, status: 200 }))

					}
				}
			}, context.url.pathname, context.request.method, context)
		},
	)
}

const is_anything: Validator<any> = {
	is_valid: (input: unknown): input is any => true,
	get_messages: (input: unknown, name: string) => [],
}

const body_validator = jv.object({
	service: jv.is_string,
	args: jv.object_values(is_anything),
	contact: jv.object_values(is_anything),
})

export default handle_request
