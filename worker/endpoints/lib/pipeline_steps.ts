import { Result } from '../../effecty_middleware.ts'
import { error_response } from '../../response_helpers.ts'
import { verifySolution } from 'altcha-lib'
import type { Company } from '#companies/companies.js'
import type { Env } from '../../environment.ts'

export const verify_altcha = async <Context extends { env: Env }>({
	altcha_payload,
	...context
}: { altcha_payload: string } & Context) => {
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
	return Result.success(context)
}

export const validate_contact = <Contact, Context extends { company: Company<string, any, any> }>({
	contact,
	...context
}: { contact: Contact } & Context) => {
	if (!context.company.contact_validator.is_valid(contact)) {
		return Result.failure(
			error_response({
				message:
					'Invalid contact: ' + context.company.contact_validator.get_messages(contact, 'body.contact').join(', '),
			}),
		)
	}
	return Result.success({ ...context, contact })
}

export const resolve_recipient_email = ({
	env,
	contact_email,
	company_email,
}: {
	env: Env
	contact_email: string
	company_email: string | string[]
}) =>
	env.ENVIRONMENT === 'local'
		? 'josh@instantestimatecentral.com'
		: contact_email.toLowerCase() === 'me+iectest@joshduff.com'
			? 'josh@instantestimatecentral.com'
			: company_email
