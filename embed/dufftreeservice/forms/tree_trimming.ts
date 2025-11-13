import fnum, { increase_by_ratio } from '#lib/fnum.ts'
import { exact, is_boolean, object, one_of, type Validator } from '#lib/json_validator.ts'
import type { FinancialNumber } from 'financial-number'

type TreeDiameter = '6-10 inches'
	| '11-15 inches'
	| '16-20 inches'
	| '21-25 inches'
	| '26-32 inches'
	| '33-40 inches'

type TrimType = 'just the necessities' | 'normal' | 'premium'

type TreeVariety = 'oak' | 'sycamore' | 'locust' | 'other'

export type PricingArguments = {
	tree_diameter: TreeDiameter
	pruned_by_arborist_recently: boolean
	raise_canopy: boolean
	tree_variety: TreeVariety
	trim_type: TrimType
}

export const pricing = ({
	tree_diameter,
	pruned_by_arborist_recently,
	raise_canopy,
	tree_variety,
	trim_type,
}: PricingArguments): FinancialNumber => {
	const base_price = get_base_price({ tree_diameter, trim_type })

	let subtotal = base_price

	if (raise_canopy) {
		subtotal = subtotal.plus(fnum('75'))
	}

	const pruned_by_arborist_discount = pruned_by_arborist_recently
		? subtotal.times(fnum('-0.10'))
		: fnum('0')

	const variety_adjustment = get_variety_adjustment({ tree_variety, subtotal })

	const total = subtotal
		.plus(pruned_by_arborist_discount)
		.plus(variety_adjustment)

	return total
}

const price_matrix: Record<TreeDiameter, Record<TrimType, string>> = {
	'6-10 inches': {
		'just the necessities': '300',
		'normal': '500',
		'premium': '700',
	},
	'11-15 inches': {
		'just the necessities': '500',
		'normal': '800',
		'premium': '1050',
	},
	'16-20 inches': {
		'just the necessities': '600',
		'normal': '900',
		'premium': '1200',
	},
	'21-25 inches': {
		'just the necessities': '700',
		'normal': '1150',
		'premium': '1500',
	},
	'26-32 inches': {
		'just the necessities': '800',
		'normal': '1300',
		'premium': '2000',
	},
	'33-40 inches': {
		'just the necessities': '900',
		'normal': '1500',
		'premium': '2450',
	},
}

const get_base_price = ({
	tree_diameter,
	trim_type,
}: {
	tree_diameter: TreeDiameter
	trim_type: TrimType
}): FinancialNumber => fnum(price_matrix[tree_diameter][trim_type])

const get_variety_adjustment = ({
	tree_variety,
	subtotal,
}: {
	tree_variety: TreeVariety
	subtotal: FinancialNumber
}): FinancialNumber => {
	if (tree_variety === 'oak' || tree_variety === 'locust') {
		return subtotal.times(fnum('0.15'))
	}

	if (tree_variety === 'sycamore') {
		return subtotal.times(fnum('-0.10'))
	}

	if (tree_variety === 'other') {
		return fnum('0')
	}

	tree_variety satisfies never

	throw new Error(`Unexpected tree variety: ${tree_variety}`)
}

const tree_diameter_validator: Validator<PricingArguments['tree_diameter']> = one_of(
	exact('6-10 inches' as const),
	exact('11-15 inches' as const),
	exact('16-20 inches' as const),
	exact('21-25 inches' as const),
	exact('26-32 inches' as const),
	exact('33-40 inches' as const),
)

const trim_type_validator: Validator<PricingArguments['trim_type']> = one_of(
	exact('just the necessities' as const),
	exact('normal' as const),
	exact('premium' as const),
)

const tree_variety_validator: Validator<PricingArguments['tree_variety']> = one_of(
	exact('oak' as const),
	exact('sycamore' as const),
	exact('locust' as const),
	exact('other' as const),
)

export const validator: Validator<PricingArguments> = object({
	tree_diameter: tree_diameter_validator,
	pruned_by_arborist_recently: is_boolean,
	raise_canopy: is_boolean,
	tree_variety: tree_variety_validator,
	trim_type: trim_type_validator,
})
