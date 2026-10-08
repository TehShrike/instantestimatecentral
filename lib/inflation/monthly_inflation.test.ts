import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum from '#lib/fnum.ts'
import make_monthly_inflation_calculator from './monthly_inflation.ts'

test('monthly inflation calculator', () => {
	const calculate_inflation = make_monthly_inflation_calculator({
		start_year: 2024n,
		start_month: 11n,
		monthly_rate: fnum('1.00165'),
	})

	const price = fnum('100.00')

	assert.strictEqual(
		calculate_inflation(price, { current_year: 2024n, current_month: 11n }).toString(2),
		'100.00',
		'returns the original price when current date equals start date',
	)

	assert.strictEqual(
		calculate_inflation(price, { current_year: 2024n, current_month: 12n }).toString(2),
		'100.17',
		'compounds monthly rate for each month elapsed',
	)

	assert.strictEqual(
		calculate_inflation(price, { current_year: 2025n, current_month: 2n }).toString(2),
		'100.50',
		'handles year boundary correctly',
	)

	assert.strictEqual(
		calculate_inflation(price, { current_year: 2025n, current_month: 11n }).toString(2),
		'102.00',
		'compounding 12 months equals approximately 2% annual inflation',
	)

	assert.strictEqual(
		calculate_inflation(price).gt(price),
		true,
		'uses current date by default, inflated price should be greater than input',
	)
})

test('uses default monthly rate when not specified', () => {
	const calc = make_monthly_inflation_calculator({
		start_year: 2024n,
		start_month: 1n,
	})

	assert.strictEqual(calc(fnum('100.00'), { current_year: 2025n, current_month: 1n }).toString(2), '102.00')
})
