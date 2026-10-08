import { test } from 'node:test'
import * as assert from 'node:assert'
import { pricing, type TreePlantingPricingArguments } from './tree_planting.ts'
import { for_each } from '#lib/array.ts'

const generate_all_cases = (): TreePlantingPricingArguments[] => {
	const tree_size_values = ['1 gallon', '3 gallons', '7 gallons', '15 gallons'] as const
	const number_of_trees_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

	const result: TreePlantingPricingArguments[] = []

	for_each(tree_size_values, (tree_size) => {
		for_each(number_of_trees_values, (number_of_trees) => {
			result.push({
				tree_size,
				number_of_trees,
			})
		})
	})

	return result
}

const cases = generate_all_cases()

test(`dufftreeservice tree planting pricing: ${cases.length} cases`, () => {
	let highest_price_result = pricing(cases[0]!)
	let highest_price_args = cases[0]!
	let lowest_price_result = pricing(cases[0]!)
	let lowest_price_args = cases[0]!

	for_each(cases, (arg) => {
		const result = pricing(arg)

		assert.ok(
			result.rounded_price_after_inflation.gte('100'),
			`Price should be at least $100, got ${result.rounded_price_after_inflation.toString()} for ${JSON.stringify(arg)}`,
		)
		assert.ok(
			result.rounded_original_price.lt('10000'),
			`Price should be less than $10,000, got ${result.rounded_original_price.toString()} for ${JSON.stringify(arg)}`,
		)

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
