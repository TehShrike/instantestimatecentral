import { round, withDefaultRoundingStrategy } from 'financial-number'
import type { FinancialNumber } from 'financial-number'
import assert from '#lib/assert.ts'

const number = withDefaultRoundingStrategy(round)

export default number

export const greatest_of = (...numbers: readonly [FinancialNumber, ...FinancialNumber[]]): FinancialNumber => {
	assert(numbers.length > 0, 'At least one number is required')
	if (numbers.length === 1) return numbers[0]

	return numbers.reduce((greatest, current) => greatest.gt(current) ? greatest : current)
}

export const increase_by_ratio = ({
	value,
	ratio,
}:{
	value: FinancialNumber
	ratio: FinancialNumber
}) => value.times(number('1').plus(ratio))
