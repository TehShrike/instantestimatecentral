import { Validator } from "./json_validator.ts"

const PREFIX = 'instant_estimate_central_'

export const get = <T>(key: string, validator: Validator<T>, default_value: T): T => {
	const value = localStorage.getItem(PREFIX + key)
	if (value === null) {
		return default_value
	}
	const parsed_value = JSON.parse(value)

	if (!validator.is_valid(parsed_value)) {
		console.warn('Invalid value for key', key, validator.get_messages(parsed_value, 'value').join(', '))
		return default_value
	}
	return parsed_value
}

export const set = <T>(key: string, value: T) => {
	localStorage.setItem(PREFIX + key, JSON.stringify(value))
}
