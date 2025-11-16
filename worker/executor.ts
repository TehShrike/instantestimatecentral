import domain_to_pricing_map, { domain_validator } from '#pricing/index.ts'
import pipeline, { Result } from './effecty_middleware.ts'
import { route } from './effecty_router.ts'
import { send_email } from '#lib/resend.ts'
import type { FinancialNumber } from 'financial-number'
import * as jv from '#lib/json_validator.ts'
import { Validator } from '#lib/json_validator.ts'
import { error_response, response } from './response_helpers.ts'

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

			const domain_services = domain_to_pricing_map[domain]

			return Result.success({...context, domain, domain_services})
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

						const {pricing} = context.domain_services.services[service].pricing

						const price = pricing(pricing_args)

						return Result.success({...context, price, body	})
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

const send_estimate_email = async ({
	env,
	price,
	domain,
	company_name,
	service_name,
	contact,
	args
}: {env: Pick<Env, 'RESEND_API_KEY'>, price: FinancialNumber, domain: string, company_name: string, service_name: string, contact: { name: string, email: string, phone: string, street_address: string }, args: Record<string, unknown>}) => {
	return send_email({
		api_key: env.RESEND_API_KEY,
		from: 'Instant Estimate Central <josh@instantestimatecentral.com>',
		to: ['me@joshduff.com'],
		subject: company.render_subject(service, price),
		html: company.render_html({service, contact, price, estimate_arguments: args}),
	})
}

export default handle_request
