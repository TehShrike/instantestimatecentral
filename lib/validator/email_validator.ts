import type { Validator } from './json_validator.ts'

const regex = /.+@.*\./

const email_validator: Validator<string> = {
	is_valid: (input: unknown): input is string => typeof input === 'string' && regex.test(input),
	get_messages: (input: unknown, name: string) =>
		typeof input === 'string' && regex.test(input)
			? []
			: [`"${name}" must contain at least one character before an @ followed by a period`],
}

export default email_validator
