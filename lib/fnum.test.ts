import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum, { round_to_nearest_5 } from './fnum.ts'

test('round_to_nearest_5 with numbers 10 to 20', () => {
	const test_cases = [
		{ input: '10', expected: '10' },
		{ input: '11', expected: '10' },
		{ input: '12', expected: '10' },
		{ input: '13', expected: '15' },
		{ input: '14', expected: '15' },
		{ input: '15', expected: '15' },
		{ input: '16', expected: '15' },
		{ input: '17', expected: '15' },
		{ input: '18', expected: '20' },
		{ input: '19', expected: '20' },
		{ input: '20', expected: '20' },
	]

	for (const { input, expected } of test_cases) {
		const result = round_to_nearest_5(fnum(input))
		assert.strictEqual(
			result.toString(),
			expected,
			`round_to_nearest_5(${input}) should equal ${expected}, got ${result.toString()}`
		)
	}
})
