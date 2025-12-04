import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum from '#lib/fnum.ts'
import compound from './compound.ts'

test('compounding with period 0 returns the input value', () => {
	const initial_value = fnum('100.00')
	const rate = fnum('1.05')

	const result = compound(initial_value, rate, 0n)

	assert.strictEqual(result.toString(), initial_value.toString())
})

test('compounding 1.00165 for 12 periods equals multiplying by 1.02', () => {
	const initial_value = fnum('100.00')
	const monthly_rate = fnum('1.00165')
	const annual_rate = fnum('1.02')

	const compounded_result = compound(initial_value, monthly_rate, 12n)
	const direct_multiplication_result = initial_value.times(annual_rate)

	assert.strictEqual(
		compounded_result.toString(2),
		direct_multiplication_result.toString(2),
		`Compounding ${initial_value.toString()} at ${monthly_rate.toString()} for 12 periods should equal multiplying by ${annual_rate.toString()}`,
	)
})
