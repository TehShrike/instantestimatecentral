import pipeline, { Result } from '../effecty_middleware.ts'
import { json_response, error_response } from '../response_helpers.ts'
import { send_email } from '#lib/resend.ts'
import * as jv from '#lib/validator/json_validator.ts'
import { is_anything, altcha_payload_validator, contact_validator } from './lib/validators.ts'
import { verify_altcha, validate_contact, resolve_recipient_email } from './lib/pipeline_steps.ts'
import type { Company } from '#companies/companies.js'
import type { Env } from '../environment.ts'

const body_validator = jv.object({
	service: jv.is_string,
	args: jv.object_values(is_anything),
	contact: contact_validator,
	altcha_payload: altcha_payload_validator,
})

const send_estimate_email = ({ body, company, env }: { body: unknown; company: Company<string, any, any>; env: Env }) =>
	pipeline(
		{ body, company, env },
		({ body, ...context }) => {
			if (!body_validator.is_valid(body)) {
				return Result.failure(error_response({ message: body_validator.get_messages(body, 'body').join(', ') }))
			}
			const { service: service_name, args: pricing_args, contact, altcha_payload } = body
			return Result.success({ ...context, service_name, pricing_args, contact, altcha_payload })
		},
		verify_altcha,
		({ service_name, ...context }) => {
			if (!context.company.service_name_validator.is_valid(service_name)) {
				return Result.failure(
					error_response({
						message:
							'Invalid service name: ' +
							context.company.service_name_validator.get_messages(service_name, 'body.service').join(', '),
					}),
				)
			}
			return Result.success({
				...context,
				service: context.company.services[service_name as keyof typeof context.company.services],
			})
		},
		({ pricing_args, ...context }) => {
			if (!context.service.validator.is_valid(pricing_args)) {
				return Result.failure(
					error_response({
						message:
							'Invalid pricing function arguments: ' +
							context.service.validator.get_messages(pricing_args, 'body.args').join(', '),
					}),
				)
			}
			return Result.success({ ...context, pricing_args })
		},
		validate_contact,
		async ({ service, pricing_args, contact, company, env }) => {
			const price = service.pricing(pricing_args as any)

			const subject = company.render_subject(service, price)
			const html = company.render_html({
				service,
				contact,
				price,
				estimate_arguments: pricing_args as any,
			})

			const to = resolve_recipient_email({
				env,
				contact_email: contact.email,
				company_email: company.recipient_email_address,
			})

			await send_email({
				api_key: env.RESEND_API_KEY,
				from: 'Instant Estimate Central <estimate@estimate.instantestimatecentral.com>',
				reply_to: `Josh <josh@instantestimatecentral.com>`,
				to,
				subject,
				html,
			})

			return Result.success(json_response({ body: { success: true }, status: 200 }))
		},
	)

export default send_estimate_email
