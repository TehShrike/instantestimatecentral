import domain_to_company_map, { domain_validator } from '#pricing/index.ts'
import pipeline, { Result } from './effecty_middleware.ts'
import { route } from './effecty_router.ts'
import { send_email } from '#lib/resend.ts'
import type { FinancialNumber } from 'financial-number'
import * as jv from '#lib/json_validator.ts'
import { Validator } from '#lib/json_validator.ts'
import { error_response, response, json_response } from './response_helpers.ts'

interface Env {
	RESEND_API_KEY: string
}

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

			const company = domain_to_company_map[domain]

			return Result.success({...context, domain, company})
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

						await send_email({
							api_key: context.env.RESEND_API_KEY,
							from: 'Instant Estimate Central <josh@instantestimatecentral.com>',
							to: company.recipient_email_address,
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
