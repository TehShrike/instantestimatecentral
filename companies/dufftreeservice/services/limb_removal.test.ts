import { test } from 'node:test'
import * as assert from 'node:assert'
import { pricing, type LimbRemovalPricingArguments } from './limb_removal.ts'
import { for_each } from '#lib/array.ts'

const generate_all_cases = (): LimbRemovalPricingArguments[] => {
	const is_it_broken_values = [true, false]
	const how_big_around_is_it_values = ['1-3 inches', '3-5 inches', '6-9 inches', '10-13 inches', '14+ inches'] as const
	const distance_from_ground_values = ['under 15 feet', '15-20 feet', 'higher than 20 feet'] as const
	const branches_over_something_values = [true, false]
	const easy_to_haul_out_values = [true, false]

	const result: LimbRemovalPricingArguments[] = []

	for_each(is_it_broken_values, (is_it_broken) => {
		for_each(how_big_around_is_it_values, (how_big_around_is_it) => {
			for_each(distance_from_ground_values, (distance_from_ground) => {
				for_each(branches_over_something_values, (branches_over_something) => {
					for_each(easy_to_haul_out_values, (easy_to_haul_out) => {
						result.push({
							is_it_broken,
							limb_diameter: how_big_around_is_it,
							distance_from_ground,
							branches_over_something,
							easy_to_haul_out,
						})
					})
				})
			})
		})
	})

	return result
}

const cases = generate_all_cases()

test(`dufftreeservice limb removal pricing: ${cases.length} cases`, () => {
	let highest_price_result = pricing(cases[0]!)
	let highest_price_args = cases[0]!
	let lowest_price_result = pricing(cases[0]!)
	let lowest_price_args = cases[0]!

	for_each(cases, (arg) => {
		const result = pricing(arg)

		assert.ok(result.rounded_price_after_inflation.gte('300'))

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
