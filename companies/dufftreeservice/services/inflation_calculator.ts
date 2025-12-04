import make_monthly_inflation_calculator from '#lib/inflation/monthly_inflation.ts'

const inflation_calculator = make_monthly_inflation_calculator({
	start_year: 2025n,
	start_month: 11n,
})

export default inflation_calculator
