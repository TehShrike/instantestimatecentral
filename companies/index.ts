import { type Validator } from '#lib/json_validator.ts'
import { type DomainNameToCompany } from '#companies/companies.js'
import dufftreeservice from './dufftreeservice/index.ts'

const domain_to_company_map = {
	'dufftreeservice.com': dufftreeservice,
	'www.dufftreeservice.com': dufftreeservice,
	'example-customer-site.com': dufftreeservice,
	'www.instantestimatecentral.com': dufftreeservice,
} as const satisfies DomainNameToCompany

export default domain_to_company_map

export const domain_validator: Validator<keyof typeof domain_to_company_map> = {
	is_valid: (input): input is keyof typeof domain_to_company_map =>
		typeof input === 'string' && input in domain_to_company_map,
	get_messages: (input, name) => {
		if (typeof input !== 'string') {
			return [`${name} should be a string`]
		}
		if (!(input in domain_to_company_map)) {
			return [
				`${name} should be one of ${Object.keys(domain_to_company_map)
					.map((key) => `"${key}"`)
					.join(', ')}`,
			]
		}
		return []
	},
}
