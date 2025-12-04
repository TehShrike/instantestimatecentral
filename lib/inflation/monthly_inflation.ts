import type { FinancialNumber } from 'financial-number'
import fnum from '#lib/fnum.ts'
import compound from './compound.ts'

const DEFAULT_MONTHLY_RATE = fnum('1.00165')

const get_current_year_and_month = (): {
	current_year: bigint
	current_month: bigint
} => {
	const now = new Date()
	return {
		current_year: BigInt(now.getFullYear()),
		current_month: BigInt(now.getMonth() + 1),
	}
}

const make_monthly_inflation_calculator = ({
	start_year,
	start_month,
	monthly_rate = DEFAULT_MONTHLY_RATE,
}: {
	start_year: bigint
	start_month: bigint
	monthly_rate?: FinancialNumber
}) => (price: FinancialNumber, current_year_and_month = get_current_year_and_month()) => {
	const { current_year, current_month } = current_year_and_month
	const months_elapsed = (current_year - start_year) * 12n + (current_month - start_month)

	return compound(price, monthly_rate, months_elapsed)
}

export default make_monthly_inflation_calculator
