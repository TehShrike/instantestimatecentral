import fnum, { greatest_of, increase_by_ratio } from '#lib/fnum.ts'
import { exact, object, one_of, Validator } from '#lib/json_validator.ts'
import { is_boolean } from '#lib/json_validator.ts'
import type { FinancialNumber } from 'financial-number'

const MINIMUM_PRICE = fnum('300')

type LimbWidth = '1-3 inches'
	| '3-5 inches'
	| '6-9 inches'
	| '10-13 inches'
	| '14+ inches'

type DistanceFromGround = 'under 15 feet' | '15-20 feet' | 'higher than 20 feet'

export type PricingArguments = {
	is_it_broken: boolean
	how_big_around_is_it: LimbWidth
	distance_from_ground: DistanceFromGround
	branches_over_something: boolean
	easy_to_haul_out: boolean
}

export const pricing = ({
	is_it_broken,
	how_big_around_is_it,
	distance_from_ground,
	branches_over_something,
	easy_to_haul_out,
}: PricingArguments) => {
	const need_to_climb = !can_we_get_it_without_climbing({ distance_from_ground, how_big_around_is_it })

	const base_price = fnum('300')
	const subtotal = base_price.plus(increase_price_based_just_on_size({ how_big_around_is_it, need_to_climb }))

	const broken_branches_increase = is_it_broken
		? increase_by_ratio({
			value: subtotal,
			ratio: cost_increase_ratio_for_broken_branches({ how_big_around_is_it }),
		})
		: fnum('0')

	const over_something_increase = branches_over_something
		? increase_by_ratio({
			value: subtotal,
			ratio: cost_increase_ratio_if_its_over_something({ how_big_around_is_it }),
		})
		: fnum('0')

	const not_easy_to_haul_out_increase = easy_to_haul_out
		? fnum('0')
		: increase_by_ratio({
			value: subtotal,
			ratio: cost_increase_ratio_if_its_not_easy_to_haul_out({ how_big_around_is_it }),
		})

	const total = subtotal
		.plus(broken_branches_increase)
		.plus(over_something_increase)
		.plus(not_easy_to_haul_out_increase)

	return greatest_of(MINIMUM_PRICE, total)
}

const can_we_get_it_without_climbing = ({
	distance_from_ground,
	how_big_around_is_it,
}: {
	distance_from_ground: DistanceFromGround
	how_big_around_is_it: LimbWidth
}) => {
	if (distance_from_ground === 'under 15 feet')
		return how_big_around_is_it === '1-3 inches' || how_big_around_is_it === '3-5 inches'

	if (distance_from_ground === '15-20 feet')
		return how_big_around_is_it === '1-3 inches'

	return false
}

const increase_price_based_just_on_size = ({
	how_big_around_is_it,
	need_to_climb,
}: {
	how_big_around_is_it: LimbWidth
	need_to_climb: boolean
}) => {
	if (!need_to_climb && how_big_around_is_it === '3-5 inches')
		return fnum('150')

	if (need_to_climb) {
		if (how_big_around_is_it === '1-3 inches')
			return fnum('150')

		if (how_big_around_is_it === '3-5 inches')
			return fnum('200')

		if (how_big_around_is_it === '6-9 inches')
			return fnum('500')
	}

	if (how_big_around_is_it === '10-13 inches')
		return fnum('600')

	if (how_big_around_is_it === '14+ inches')
		return fnum('1100')

	return fnum('0')
}

const cost_increase_ratio_for_broken_branches = ({
	how_big_around_is_it,
}: {
	how_big_around_is_it: LimbWidth
}) => {
	if (how_big_around_is_it === '3-5 inches')
		return fnum('0.15')

	if (how_big_around_is_it === '6-9 inches')
		return fnum('0.25')

	if (how_big_around_is_it === '10-13 inches')
		return fnum('0.3')

	if (how_big_around_is_it === '14+ inches')
		return fnum('0.4')

	return fnum('0')
}

const cost_increase_ratio_if_its_over_something = ({
	how_big_around_is_it,
}: {
	how_big_around_is_it: LimbWidth
}) => {
	if (how_big_around_is_it === '3-5 inches') {
		return fnum('0.1')
	}

	if (how_big_around_is_it === '6-9 inches' || how_big_around_is_it === '10-13 inches') {
		return fnum('0.25')
	}

	if (how_big_around_is_it === '14+ inches') {
		return fnum('0.4')
	}

	return fnum('0')
}

const cost_increase_ratio_if_its_not_easy_to_haul_out = ({
	how_big_around_is_it,
}: {
	how_big_around_is_it: LimbWidth
}) => {
	if (how_big_around_is_it === '6-9 inches') {
		return fnum('0.25')
	}

	if (how_big_around_is_it === '10-13 inches') {
		return fnum('0.3')
	}

	if (how_big_around_is_it === '14+ inches') {
		return fnum('0.4')
	}

	return fnum('0')
}









const how_big_around_is_it_validator: Validator<PricingArguments['how_big_around_is_it']> = one_of(
	exact('1-3 inches' as const),
	exact('3-5 inches' as const),
	exact('6-9 inches' as const),
	exact('10-13 inches' as const),
	exact('14+ inches' as const),
)

const distance_from_ground_validator: Validator<PricingArguments['distance_from_ground']> = one_of(
	exact('under 15 feet' as const),
	exact('15-20 feet' as const),
	exact('higher than 20 feet' as const),
)

export const validator: Validator<PricingArguments> = object({
	is_it_broken: is_boolean,
	how_big_around_is_it: how_big_around_is_it_validator,
	distance_from_ground: distance_from_ground_validator,
	branches_over_something: is_boolean,
	easy_to_haul_out: is_boolean,
})

