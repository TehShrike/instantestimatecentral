import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum from './fnum.ts'
import { round_to_nearest_5, round_to_nearest_10, round_to_nearest_50 } from './estimate_price_rounder.ts'
import { for_each } from './array.ts'

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

	for_each(test_cases, ({ input, expected }) => {
		const result = round_to_nearest_5(fnum(input))
		assert.strictEqual(
			result.toString(),
			expected,
			`round_to_nearest_5(${input}) should equal ${expected}, got ${result.toString()}`,
		)
	})
})

test('round_to_nearest_10 with numbers 100 to 120', () => {
	const test_cases = [
		{ input: '100', expected: '100' },
		{ input: '101', expected: '100' },
		{ input: '102', expected: '100' },
		{ input: '103', expected: '100' },
		{ input: '104', expected: '100' },
		{ input: '105', expected: '110' },
		{ input: '106', expected: '110' },
		{ input: '107', expected: '110' },
		{ input: '108', expected: '110' },
		{ input: '109', expected: '110' },
		{ input: '110', expected: '110' },
		{ input: '111', expected: '110' },
		{ input: '112', expected: '110' },
		{ input: '113', expected: '110' },
		{ input: '114', expected: '110' },
		{ input: '115', expected: '120' },
		{ input: '116', expected: '120' },
		{ input: '117', expected: '120' },
		{ input: '118', expected: '120' },
		{ input: '119', expected: '120' },
		{ input: '120', expected: '120' },
	]

	for_each(test_cases, ({ input, expected }) => {
		const result = round_to_nearest_10(fnum(input))
		assert.strictEqual(
			result.toString(),
			expected,
			`round_to_nearest_10(${input}) should equal ${expected}, got ${result.toString()}`,
		)
	})
})

test('round_to_nearest_50 with numbers 100 to 180', () => {
	const test_cases = [
		{ input: '100', expected: '100' },
		{ input: '101', expected: '100' },
		{ input: '102', expected: '100' },
		{ input: '103', expected: '100' },
		{ input: '104', expected: '100' },
		{ input: '105', expected: '100' },
		{ input: '106', expected: '100' },
		{ input: '107', expected: '100' },
		{ input: '108', expected: '100' },
		{ input: '109', expected: '100' },
		{ input: '110', expected: '100' },
		{ input: '111', expected: '100' },
		{ input: '112', expected: '100' },
		{ input: '113', expected: '100' },
		{ input: '114', expected: '100' },
		{ input: '115', expected: '100' },
		{ input: '116', expected: '100' },
		{ input: '117', expected: '100' },
		{ input: '118', expected: '100' },
		{ input: '119', expected: '100' },
		{ input: '120', expected: '100' },
		{ input: '121', expected: '100' },
		{ input: '122', expected: '100' },
		{ input: '123', expected: '100' },
		{ input: '124', expected: '100' },
		{ input: '125', expected: '150' },
		{ input: '126', expected: '150' },
		{ input: '127', expected: '150' },
		{ input: '128', expected: '150' },
		{ input: '129', expected: '150' },
		{ input: '130', expected: '150' },
		{ input: '131', expected: '150' },
		{ input: '132', expected: '150' },
		{ input: '133', expected: '150' },
		{ input: '134', expected: '150' },
		{ input: '135', expected: '150' },
		{ input: '136', expected: '150' },
		{ input: '137', expected: '150' },
		{ input: '138', expected: '150' },
		{ input: '139', expected: '150' },
		{ input: '140', expected: '150' },
		{ input: '141', expected: '150' },
		{ input: '142', expected: '150' },
		{ input: '143', expected: '150' },
		{ input: '144', expected: '150' },
		{ input: '145', expected: '150' },
		{ input: '146', expected: '150' },
		{ input: '147', expected: '150' },
		{ input: '148', expected: '150' },
		{ input: '149', expected: '150' },
		{ input: '150', expected: '150' },
		{ input: '151', expected: '150' },
		{ input: '152', expected: '150' },
		{ input: '153', expected: '150' },
		{ input: '154', expected: '150' },
		{ input: '155', expected: '150' },
		{ input: '156', expected: '150' },
		{ input: '157', expected: '150' },
		{ input: '158', expected: '150' },
		{ input: '159', expected: '150' },
		{ input: '160', expected: '150' },
		{ input: '161', expected: '150' },
		{ input: '162', expected: '150' },
		{ input: '163', expected: '150' },
		{ input: '164', expected: '150' },
		{ input: '165', expected: '150' },
		{ input: '166', expected: '150' },
		{ input: '167', expected: '150' },
		{ input: '168', expected: '150' },
		{ input: '169', expected: '150' },
		{ input: '170', expected: '150' },
		{ input: '171', expected: '150' },
		{ input: '172', expected: '150' },
		{ input: '173', expected: '150' },
		{ input: '174', expected: '150' },
		{ input: '175', expected: '200' },
		{ input: '176', expected: '200' },
		{ input: '177', expected: '200' },
		{ input: '178', expected: '200' },
		{ input: '179', expected: '200' },
		{ input: '180', expected: '200' },
	]

	for_each(test_cases, ({ input, expected }) => {
		const result = round_to_nearest_50(fnum(input))
		assert.strictEqual(
			result.toString(),
			expected,
			`round_to_nearest_50(${input}) should equal ${expected}, got ${result.toString()}`,
		)
	})
})
