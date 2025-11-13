import { type Validator } from '#lib/json_validator.ts'
import { type FinancialNumber } from 'financial-number'
import { type DomainNameToPricing } from './pricing.js'
import dufftreeservice from './dufftreeservice/index.ts'

export default {
	'dufftreeservice.com': dufftreeservice,
} as const satisfies DomainNameToPricing
