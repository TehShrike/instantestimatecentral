import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum from '#lib/fnum.ts'
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
	let highest_price = fnum('0')
	let highest_price_args: TreePlantingPricingArguments | null = null
	let lowest_price = fnum('999999')
	let lowest_price_args: TreePlantingPricingArguments | null = null

	for_each(cases, (arg) => {
		const price = pricing(arg)

		if (price.gt(highest_price)) {
			highest_price = price
			highest_price_args = arg
		}

		if (price.lt(lowest_price)) {
			lowest_price = price
			lowest_price_args = arg
		}

		assert.ok(price.gte('100'), `Price should be at least $100, got ${price.toString()} for ${JSON.stringify(arg)}`)
		assert.ok(
			price.lt('10000'),
			`Price should be less than $10,000, got ${price.toString()} for ${JSON.stringify(arg)}`,
		)
	})

	console.log('Highest:', highest_price.toString(2), highest_price_args)
	console.log('Lowest:', lowest_price.toString(2), lowest_price_args)
})
