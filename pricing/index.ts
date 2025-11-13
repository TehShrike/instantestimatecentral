import { type Validator } from '#lib/json_validator.ts'
import { type FinancialNumber } from 'financial-number'
import * as dufftreeservice from './dufftreeservice/index.ts'

export default {
	'dufftreeservice.com': dufftreeservice,
} satisfies DomainNameToPricing<unknown>
