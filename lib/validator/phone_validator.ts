import type { Validator } from './json_validator.ts'

const count_digits = (str: string) => str.replace(/\D/g, '').length

const phone_validator: Validator<string> = {
	is_valid: (input: unknown): input is string => typeof input === 'string' && count_digits(input) >= 7,
	get_messages: (input: unknown, name: string) =>
		typeof input === 'string' && count_digits(input) >= 7 ? [] : [`"${name}" must contain at least 7 digits`],
}

export default phone_validator
