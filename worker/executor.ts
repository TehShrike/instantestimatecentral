import domain_to_company_map, { domain_validator } from '#companies/index.ts'
import pipeline, { Result } from './effecty_middleware.ts'
import { route } from './effecty_router.ts'
import { send_email } from '#lib/resend.ts'
import * as jv from '#lib/validator/json_validator.ts'
import { Validator } from '#lib/validator/json_validator.ts'
import { response, json_response, error_response } from './response_helpers.ts'
import type { Env } from './environment.ts'

const validate_turnstile = async (token: string, secret_key: string): Promise<{ success: boolean; error?: string }> => {
	const form_data = new FormData()
	form_data.append('secret', secret_key)
	form_data.append('response', token)

	const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: form_data,
	})

	const outcome = (await result.json()) as { success: boolean; 'error-codes'?: string[] }

	if (!outcome.success) {
		return { success: false, error: outcome['error-codes']?.join(', ') || 'Unknown error' }
	}

	return { success: true }
}

const handle_request = async (
	request: Request,
	env: Env,
): Promise<Result<Response, Response | { message: string; stack?: string | null }, Response>> => {
	const initial_context = { request, env, url: new URL(request.url) }

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

			return Result.success({ ...context, company })
		},
		(context) => {
			if (context.request.method === 'OPTIONS') {
				return Result.interrupt(response({ status: 204 }))
			}

			return Result.success(context)
		},
		async (context) => {
			try {
				const body = await request.json()

				return Result.success({ ...context, body })
			} catch (e) {
				return Result.failure(error_response({ message: 'Invalid JSON' }))
			}
		},
		(context) => {
			return route(
				{
					'/send_estimate_email': {
						POST: async ({ body, company, ...context }) => {
							if (!body_validator.is_valid(body)) {
								return Result.failure(error_response({ message: body_validator.get_messages(body, 'body').join(', ') }))
							}
							const { service: service_name, args: pricing_args, contact, turnstile_token } = body

							try {
								const TURNSTILE_DISABLED_FOR_NOW = true
								if (context.env.ENVIRONMENT !== 'local' && !TURNSTILE_DISABLED_FOR_NOW) {
									console.log('Validating turnstile token:', turnstile_token)
									// If turnstile_token is null, still validate with CF – if CF is down, it's acceptable to not have a valid token
									const turnstile_result = await validate_turnstile(
										turnstile_token || 'none',
										context.env.CF_TURNSTILE_SECRET_KEY,
									)
									if (!turnstile_result.success) {
										return Result.failure(
											error_response({
												message:
													'Security verification failed: ' +
													(turnstile_result.error || 'Unknown error') +
													'\nPlease make sure the captcha was successfully completed.',
											}),
										)
									}
								}
							} catch (error) {
								console.error('Error validating turnstile:', error instanceof Error ? error.message : String(error))
								// Don't fail out – if the request to turnstile fails, we'll give the user the benefit of the doubt
								// TODO: report error to Sentry?
							}

							if (!company.service_name_validator.is_valid(service_name)) {
								return Result.failure(
									error_response({
										message:
											'Invalid service name: ' +
											company.service_name_validator.get_messages(service_name, 'body.service').join(', '),
									}),
								)
							}

							const service = company.services[service_name as keyof typeof company.services]

							if (!service.validator.is_valid(pricing_args)) {
								return Result.failure(
									error_response({
										message:
											'Invalid pricing function arguments: ' +
											service.validator.get_messages(body.args, 'body.args').join(', '),
									}),
								)
							}

							if (!company.contact_validator.is_valid(contact)) {
								return Result.failure(
									error_response({
										message:
											'Invalid contact: ' + company.contact_validator.get_messages(contact, 'body.contact').join(', '),
									}),
								)
							}

							const price = service.pricing(pricing_args as any)

							const subject = company.render_subject(service, price)
							const html = company.render_html({
								service: service,
								contact: contact as any,
								price: price,
								estimate_arguments: pricing_args as any,
							})

							const to =
								context.env.ENVIRONMENT === 'local'
									? 'josh@instantestimatecentral.com'
									: contact.email.toLowerCase() === 'me+iectest@joshduff.com'
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
						},
					},
				},
				context.url.pathname,
				context.request.method,
				context,
			)
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
	turnstile_token: jv.one_of(jv.is_string, jv.is_null),
})

export default handle_request
