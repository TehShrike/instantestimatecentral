import pipeline, { Result } from '../effecty_middleware.ts'
import { json_response, error_response } from '../response_helpers.ts'
import { send_email } from '#lib/resend.ts'
import * as jv from '#lib/validator/json_validator.ts'
import { altcha_payload_validator, contact_validator } from './lib/validators.ts'
import { verify_altcha, validate_contact, resolve_recipient_email } from './lib/pipeline_steps.ts'
import type { Company } from '#companies/companies.js'
import type { Env } from '../environment.ts'

const body_validator = jv.object({
	contact: contact_validator,
	altcha_payload: altcha_payload_validator,
})

const send_contact_email = ({ body, company, env }: { body: unknown; company: Company<string, any, any>; env: Env }) =>
	pipeline(
		{ body, company, env },
		({ body, ...context }) => {
			if (!body_validator.is_valid(body)) {
				return Result.failure(error_response({ message: body_validator.get_messages(body, 'body').join(', ') }))
			}
			const { contact, altcha_payload } = body
			return Result.success({ ...context, contact, altcha_payload })
		},
		verify_altcha,
		validate_contact,
		async ({ contact, company, env }) => {
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
	)

export default send_contact_email
