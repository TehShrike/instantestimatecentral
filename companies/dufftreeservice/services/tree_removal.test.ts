import { test } from 'node:test'
import * as assert from 'node:assert'
import { pricing, type TreeRemovalPricingArguments } from './tree_removal.ts'
import { for_each } from '#lib/array.ts'

const generate_all_cases = (): TreeRemovalPricingArguments[] => {
	const tree_diameter_values = [
		'6-10 inches',
		'11-15 inches',
		'16-20 inches',
		'21-25 inches',
		'26-32 inches',
		'33-40 inches',
	] as const
	const branches_over_something_values = [
		'nothing underneath',
		'some branches over something',
		'all big branches are over something',
	] as const
	const fence_values = ['no', 'single gate', 'double gate'] as const
	const adjacent_to_street_or_alley_values = [true, false]

	const result: TreeRemovalPricingArguments[] = []

	for_each(tree_diameter_values, (tree_diameter) => {
		for_each(branches_over_something_values, (branches_over_something) => {
			for_each(fence_values, (fence) => {
				for_each(adjacent_to_street_or_alley_values, (adjacent_to_street_or_alley) => {
					result.push({
						tree_diameter,
						branches_over_something,
						fence,
						adjacent_to_street_or_alley,
					})
				})
			})
		})
	})

	return result
}

const cases = generate_all_cases()

test(`dufftreeservice tree removal pricing: ${cases.length} cases`, () => {
	let highest_price_result = pricing(cases[0]!)
	let highest_price_args = cases[0]!
	let lowest_price_result = pricing(cases[0]!)
	let lowest_price_args = cases[0]!

	for_each(cases, (arg) => {
		const result = pricing(arg)

		assert.ok(result.rounded_price_after_inflation.gte('600'))
		assert.ok(result.rounded_price_after_inflation.lt('8000'))

		if (result.rounded_price_after_inflation.gt(highest_price_result.rounded_price_after_inflation)) {
			highest_price_result = result
			highest_price_args = arg
		}

		if (result.rounded_price_after_inflation.lt(lowest_price_result.rounded_price_after_inflation)) {
			lowest_price_result = result
			lowest_price_args = arg
		}

		if (!result.rounded_original_price.equal(result.rounded_price_after_inflation)) {
			console.log(
				`${result.rounded_original_price.toString(0)} -> ${result.rounded_price_after_inflation.toString(0)}`,
				arg,
			)
		}
	})

	console.log('Highest:', highest_price_result.rounded_price_after_inflation.toString(0), highest_price_args)
	console.log('Lowest:', lowest_price_result.rounded_price_after_inflation.toString(0), lowest_price_args)
})
