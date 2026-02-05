import domain_to_company_map, { domain_validator } from '#companies/index.ts'
import pipeline, { Result } from './effecty_middleware.ts'
import { route } from './effecty_router.ts'
import { send_email } from '#lib/resend.ts'
import * as jv from '#lib/validator/json_validator.ts'
import { Validator } from '#lib/validator/json_validator.ts'
import { response, json_response, error_response } from './response_helpers.ts'
import type { Env } from './environment.ts'
import { createChallenge, verifySolution } from 'altcha-lib'

const ALTCHA_MAX_NUMBER = 100_000
const ALTCHA_EXPIRATION_SECONDS = 5 * 60

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
			if (context.request.method === 'GET') {
				return Result.success({ ...context, body: null })
			}

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
					'/altcha_challenge': {
						GET: async ({ env }) => {
							const expires = new Date(Date.now() + ALTCHA_EXPIRATION_SECONDS * 1000)
							const challenge = await createChallenge({
								hmacKey: env.ALTCHA_HMAC_KEY,
								maxNumber: ALTCHA_MAX_NUMBER,
								expires,
							})
							return Result.success(json_response({ body: challenge, status: 200 }))
						},
					},
					'/send_estimate_email': {
						POST: async ({ body, company, ...context }) => {
							if (!body_validator.is_valid(body)) {
								return Result.failure(error_response({ message: body_validator.get_messages(body, 'body').join(', ') }))
							}
							const { service: service_name, args: pricing_args, contact, altcha_payload } = body

							try {
								const is_valid = await verifySolution(altcha_payload, context.env.ALTCHA_HMAC_KEY)
								if (!is_valid) {
									return Result.failure(
										error_response({
											message: 'Security verification failed. Please try again.',
										}),
									)
								}
							} catch (error) {
								console.error('Error validating altcha:', error instanceof Error ? error.message : String(error))
								return Result.failure(
									error_response({
										message: 'Security verification error. Please try again.',
									}),
								)
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
								service,
								contact,
								price,
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
					'/send_contact_email': {
						POST: async ({ body, company, ...context }) => {
							if (!contact_email_body_validator.is_valid(body)) {
								return Result.failure(
									error_response({ message: contact_email_body_validator.get_messages(body, 'body').join(', ') }),
								)
							}
							const { contact, altcha_payload } = body

							try {
								const is_valid = await verifySolution(altcha_payload, context.env.ALTCHA_HMAC_KEY)
								if (!is_valid) {
									return Result.failure(
										error_response({
											message: 'Security verification failed. Please try again.',
										}),
									)
								}
							} catch (error) {
								console.error('Error validating altcha:', error instanceof Error ? error.message : String(error))
								return Result.failure(
									error_response({
										message: 'Security verification error. Please try again.',
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
								subject: `📞 Contact request from ${contact.name}`,
								html: `
									<h2>New Contact Request</h2>
									<h3>Contact Information</h3>
									<p><strong>Name:</strong> ${contact.name}</p>
									<p><strong>Email:</strong> ${contact.email}</p>
									<p><strong>Phone:</strong> ${contact.phone}</p>
									<p><strong>Address:</strong> ${contact.street_address}</p>
									${Object.entries(contact.extra)
										.map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
										.join('')}
								`,
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

const altcha_payload_validator = jv.regex(/^[A-Za-z0-9+/]+=*$/, 'altcha_payload must be a base64 string')
const contact_validator = jv.object({
	name: jv.is_string,
	email: jv.is_string,
	phone: jv.is_string,
	street_address: jv.is_string,
	extra: jv.object_values(jv.is_string),
})

const body_validator = jv.object({
	service: jv.is_string,
	args: jv.object_values(is_anything),
	contact: contact_validator,
	altcha_payload: altcha_payload_validator,
})

const contact_email_body_validator = jv.object({
	contact: contact_validator,
	altcha_payload: altcha_payload_validator,
})

export default handle_request
