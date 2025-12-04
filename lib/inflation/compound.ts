import type { FinancialNumber } from 'financial-number'
import assert from '#lib/assert.ts'
import number from '#lib/fnum.ts'

const compound = (initial_value: FinancialNumber, rate: FinancialNumber, period: bigint): FinancialNumber => {
	assert(rate.gte(number(1n)), `Compounding rate should be greater than or equal to 1 – was "${rate.toString()}"`)
	return initial_value.times(rate.pow(period))
}

export default compound
