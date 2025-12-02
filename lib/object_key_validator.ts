import { type Validator } from './json_validator.ts'

const object_key_validator = <const KEY extends string>(object: { [key in KEY]: any }): Validator<KEY> => ({
	is_valid: (input): input is KEY => typeof input === 'string' && input in object,
	get_messages: (input, name) => {
		if (typeof input !== 'string') {
			return [`${name} should be a string`]
		}
		const keys = Object.keys(object)
		if (!keys.includes(input)) {
			return [`${name} should be one of ${keys.map((key) => `"${key}"`).join(', ')}`]
		}
		return []
	},
})

export default object_key_validator
