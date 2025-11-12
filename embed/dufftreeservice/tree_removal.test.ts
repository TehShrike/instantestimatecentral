import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum from '#lib/fnum.ts'
import { pricing, type PricingArguments } from './tree_removal.ts'
import { for_each } from '#lib/array.ts'

const generate_all_cases = (): PricingArguments[] => {
	const tree_diameter_values = ['6-10 inches', '11-15 inches', '16-20 inches', '21-25 inches', '26-32 inches', '33-40 inches'] as const
	const branches_over_something_values = ['nothing underneath', 'some branches over something', 'all big branches are over something'] as const
	const fence_values = ['no', 'single gate', 'double gate'] as const
	const adjacent_to_street_or_alley_values = [true, false]

	const result: PricingArguments[] = []

	for (const tree_diameter of tree_diameter_values) {
		for (const branches_over_something of branches_over_something_values) {
			for (const fence of fence_values) {
				for (const adjacent_to_street_or_alley of adjacent_to_street_or_alley_values) {
					result.push({
						tree_diameter,
						branches_over_something,
						fence,
						adjacent_to_street_or_alley,
					})
				}
			}
		}
	}

	return result
}

const cases = generate_all_cases()

test(`dufftreeservice tree removal pricing: ${cases.length} cases`, () => {
	let highest_price = fnum('0')
	let highest_price_args: PricingArguments | null = null

	for_each(cases, (arg, index) => {
		const price = pricing(arg)
		if (price.gt(highest_price)) {
			highest_price = price
			highest_price_args = arg
		}
		assert.ok(pricing(arg).gte('600'))
	})

	console.log(highest_price.toString(2), highest_price_args)
})
