import { test } from 'node:test'
import * as assert from 'node:assert'
import { pricing, type TreeTrimmingPricingArguments } from './tree_trimming.ts'
import { for_each } from '#lib/array.ts'

const generate_all_cases = (): TreeTrimmingPricingArguments[] => {
	const tree_diameter_values = [
		'6-10 inches',
		'11-15 inches',
		'16-20 inches',
		'21-25 inches',
		'26-32 inches',
		'33-40 inches',
	] as const
	const pruned_by_arborist_recently_values = [true, false]
	const raise_canopy_values = [true, false]
	const tree_variety_values = ['oak', 'sycamore', 'locust', 'other'] as const
	const trim_type_values = ['just the necessities', 'normal', 'premium'] as const

	const result: TreeTrimmingPricingArguments[] = []

	for_each(tree_diameter_values, (tree_diameter) => {
		for_each(pruned_by_arborist_recently_values, (pruned_by_arborist_recently) => {
			for_each(raise_canopy_values, (raise_canopy) => {
				for_each(tree_variety_values, (tree_variety) => {
					for_each(trim_type_values, (trim_type) => {
						result.push({
							tree_diameter,
							pruned_by_arborist_recently,
							raise_canopy,
							tree_variety,
							trim_type,
						})
					})
				})
			})
		})
	})

	return result
}

const cases = generate_all_cases()

test(`dufftreeservice tree trimming pricing: ${cases.length} cases`, () => {
	let highest_price_result = pricing(cases[0]!)
	let highest_price_args = cases[0]!
	let lowest_price_result = pricing(cases[0]!)
	let lowest_price_args = cases[0]!

	for_each(cases, (arg) => {
		const result = pricing(arg)

		assert.ok(
			result.rounded_price_after_inflation.gte('200'),
			`Price after inflation should be at least $200, got ${result.rounded_price_after_inflation.toString()} for ${JSON.stringify(arg)}`,
		)
		assert.ok(
			result.original_price.lt('5000'),
			`Original price should be less than $5,000, got ${result.original_price.toString()} for ${JSON.stringify(arg)}`,
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
