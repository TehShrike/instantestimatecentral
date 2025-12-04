import fnum from '#lib/fnum.ts'
import round_estimate_price from '#lib/estimate_price_rounder.ts'
import { exact, is_boolean, object, one_of, type Validator } from '#lib/validator/json_validator.ts'
import type { PricingResult } from '#companies/companies.js'
import inflation_calculator from './inflation_calculator.ts'

export const service_name = 'Tree Removal'

type TreeDiameter = '6-10 inches' | '11-15 inches' | '16-20 inches' | '21-25 inches' | '26-32 inches' | '33-40 inches'

type BranchesOverSomething =
	| 'nothing underneath'
	| 'some branches over something'
	| 'all big branches are over something'

type Fence = 'no' | 'single gate' | 'double gate'

export type TreeRemovalPricingArguments = {
	tree_diameter: TreeDiameter
	branches_over_something: BranchesOverSomething
	fence: Fence
	adjacent_to_street_or_alley: boolean
}

export const pricing = ({
	tree_diameter,
	branches_over_something,
	fence,
	adjacent_to_street_or_alley,
}: TreeRemovalPricingArguments): PricingResult => {
	const subtotal = base_price_by_diameter({ tree_diameter })

	const branches_over_something_increase =
		branches_over_something === 'nothing underneath'
			? fnum('0')
			: subtotal.times(cost_increase_ratio_for_branches_over_something({ branches_over_something }))

	const fence_increase = fence === 'no' ? fnum('0') : subtotal.times(cost_increase_ratio_for_fence({ fence }))

	const not_adjacent_to_street_increase = adjacent_to_street_or_alley ? fnum('0') : subtotal.times(fnum('0.3'))

	const original_price = subtotal
		.plus(branches_over_something_increase)
		.plus(fence_increase)
		.plus(not_adjacent_to_street_increase)

	const price_after_inflation = inflation_calculator(original_price)

	return {
		original_price,
		rounded_original_price: round_estimate_price(original_price),
		price_after_inflation,
		rounded_price_after_inflation: round_estimate_price(price_after_inflation),
	}
}

const base_price_by_diameter = ({ tree_diameter }: { tree_diameter: TreeDiameter }) => {
	if (tree_diameter === '6-10 inches') return fnum('600')
	if (tree_diameter === '11-15 inches') return fnum('900')
	if (tree_diameter === '16-20 inches') return fnum('1200')
	if (tree_diameter === '21-25 inches') return fnum('1600')
	if (tree_diameter === '26-32 inches') return fnum('2500')
	if (tree_diameter === '33-40 inches') return fnum('3200')

	tree_diameter satisfies never
	throw new Error(`Unexpected tree diameter: ${tree_diameter}`)
}

const cost_increase_ratio_for_branches_over_something = ({
	branches_over_something,
}: {
	branches_over_something: BranchesOverSomething
}) => {
	if (branches_over_something === 'nothing underneath') return fnum('0')
	if (branches_over_something === 'some branches over something') return fnum('0.15')
	if (branches_over_something === 'all big branches are over something') return fnum('0.4')

	branches_over_something satisfies never
	throw new Error(`Unexpected branches_over_something value: ${branches_over_something}`)
}

const cost_increase_ratio_for_fence = ({ fence }: { fence: Fence }) => {
	if (fence === 'no') return fnum('0')
	if (fence === 'single gate') return fnum('0.25')
	if (fence === 'double gate') return fnum('0.1')

	fence satisfies never
	throw new Error(`Unexpected fence value: ${fence}`)
}

const tree_diameter_validator: Validator<TreeRemovalPricingArguments['tree_diameter']> = one_of(
	exact('6-10 inches' as const),
	exact('11-15 inches' as const),
	exact('16-20 inches' as const),
	exact('21-25 inches' as const),
	exact('26-32 inches' as const),
	exact('33-40 inches' as const),
)

const branches_over_something_validator: Validator<TreeRemovalPricingArguments['branches_over_something']> = one_of(
	exact('nothing underneath' as const),
	exact('some branches over something' as const),
	exact('all big branches are over something' as const),
)

const fence_validator: Validator<TreeRemovalPricingArguments['fence']> = one_of(
	exact('no' as const),
	exact('single gate' as const),
	exact('double gate' as const),
)

export const validator: Validator<TreeRemovalPricingArguments> = object({
	tree_diameter: tree_diameter_validator,
	branches_over_something: branches_over_something_validator,
	fence: fence_validator,
	adjacent_to_street_or_alley: is_boolean,
})

export const render_html = (args: TreeRemovalPricingArguments) => {
	return `
		<h2>${service_name}</h2>
		<p>Tree diameter: <strong>${args.tree_diameter}</strong></p>
		<p>Branches over something: <strong>${args.branches_over_something}</strong></p>
		<p>Fence: <strong>${args.fence}</strong></p>
		<p>Adjacent to street or alley: <strong>${args.adjacent_to_street_or_alley ? 'Yes' : 'No'}</strong></p>
	`
}

export const default_pricing_args: TreeRemovalPricingArguments = {
	tree_diameter: '11-15 inches',
	branches_over_something: 'nothing underneath',
	fence: 'no',
	adjacent_to_street_or_alley: true,
}

export default {
	pricing,
	validator,
	service_name,
	render_html,
	default_pricing_args,
} as const
