import * as jv from '#lib/validator/json_validator.ts'
import type { Validator } from '#lib/validator/json_validator.ts'

export const is_anything: Validator<any> = {
	is_valid: (input: unknown): input is any => true,
	get_messages: (input: unknown, name: string) => [],
}

export const altcha_payload_validator = jv.regex(/^[A-Za-z0-9+/]+=*$/, 'altcha_payload must be a base64 string')

export const contact_validator = jv.object({
	name: jv.is_string,
	email: jv.is_string,
	phone: jv.is_string,
	street_address: jv.is_string,
	extra: jv.object_values(jv.is_string),
})
