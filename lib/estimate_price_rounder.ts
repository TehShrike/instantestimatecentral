import type { FinancialNumber } from 'financial-number'
import number from './fnum.ts'

export const round_to_nearest_5 = (value: FinancialNumber): FinancialNumber => {
	return value.times(number('0.2')).changePrecision(0).times(number('5'))
}

export const round_to_nearest_10 = (value: FinancialNumber): FinancialNumber => {
	return value.times(number('0.1')).changePrecision(0).times(number('10'))
}

export const round_to_nearest_50 = (value: FinancialNumber): FinancialNumber => {
	return value.times(number('0.02')).changePrecision(0).times(number('50'))
}

export default (price: FinancialNumber): FinancialNumber => price.lt('1000') ? round_to_nearest_10(price) : round_to_nearest_50(price)
