import { test } from 'node:test'
import * as assert from 'node:assert'
import fnum from '#lib/fnum.ts'
import { pricing, type PricingArguments } from './limb_removal.ts'
import { for_each } from '#lib/array.ts'

const generate_all_cases = (): PricingArguments[] => {
	const is_it_broken_values = [true, false]
	const how_big_around_is_it_values = ['1-3 inches', '3-5 inches', '6-9 inches', '10-13 inches', '14+ inches'] as const
	const distance_from_ground_values = ['under 15 feet', '15-20 feet', 'higher than 20 feet'] as const
	const branches_over_something_values = [true, false]
	const easy_to_haul_out_values = [true, false]

	const result: PricingArguments[] = []

	for_each(is_it_broken_values, (is_it_broken) => {
		for_each(how_big_around_is_it_values, (how_big_around_is_it) => {
			for_each(distance_from_ground_values, (distance_from_ground) => {
				for_each(branches_over_something_values, (branches_over_something) => {
					for_each(easy_to_haul_out_values, (easy_to_haul_out) => {
						result.push({
							is_it_broken,
							how_big_around_is_it,
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
	let highest_price = fnum('0')
	let highest_price_args: PricingArguments | null = null

	for_each(cases, (arg, index) => {
		const price = pricing(arg)
		if (price.gt(highest_price)) {
			highest_price = price
			highest_price_args = arg
		}
		assert.ok(pricing(arg).gte('300'))
	})

	console.log(highest_price.toString(2), highest_price_args)
})
