import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum from '#lib/fnum.ts'
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
	let highest_price = fnum('0')
	let highest_price_args: TreeTrimmingPricingArguments | null = null
	let lowest_price = fnum('999999')
	let lowest_price_args: TreeTrimmingPricingArguments | null = null

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

		assert.ok(price.gte('200'), `Price should be at least $200, got ${price.toString()} for ${JSON.stringify(arg)}`)
		assert.ok(price.lt('5000'), `Price should be less than $5,000, got ${price.toString()} for ${JSON.stringify(arg)}`)
	})

	console.log('Highest:', highest_price.toString(2), highest_price_args)
	console.log('Lowest:', lowest_price.toString(2), lowest_price_args)
})
