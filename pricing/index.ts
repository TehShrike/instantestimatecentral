import { type Validator } from '#lib/json_validator.ts'
import { type DomainNameToCompany } from '#pricing/pricing.js'
import dufftreeservice from './dufftreeservice/index.ts'

const domain_to_pricing_map = {
	'dufftreeservice.com': dufftreeservice,
} as const satisfies DomainNameToCompany

export default domain_to_pricing_map

export const domain_validator: Validator<keyof typeof domain_to_pricing_map> = {
	is_valid: (input): input is keyof typeof domain_to_pricing_map => typeof input === 'string' && input in domain_to_pricing_map,
	get_messages: (input, name) => {
		if (typeof input !== 'string') {
			return [ `${ name } should be a string` ]
		}
		if (!(input in domain_to_pricing_map)) {
			return [ `${ name } should be one of ${ Object.keys(domain_to_pricing_map).map(key => `"${ key }"`).join(', ') }` ]
		}
		return []
	},
}
