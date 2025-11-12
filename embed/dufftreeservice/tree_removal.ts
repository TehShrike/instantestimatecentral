import fnum, { increase_by_ratio } from '#lib/fnum.ts'

type TreeDiameter =
	| '6-10 inches'
	| '11-15 inches'
	| '16-20 inches'
	| '21-25 inches'
	| '26-32 inches'
	| '33-40 inches'

type BranchesOverSomething =
	| 'nothing underneath'
	| 'some branches over something'
	| 'all big branches are over something'

type Fence = 'no' | 'single gate' | 'double gate'

export type PricingArguments = {
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
}: PricingArguments) => {
	const subtotal = base_price_by_diameter({ tree_diameter })

	const branches_over_something_increase =
		branches_over_something === 'nothing underneath'
			? fnum('0')
			: increase_by_ratio({
				value: subtotal,
				ratio: cost_increase_ratio_for_branches_over_something({ branches_over_something }),
			})

	const fence_increase =
		fence === 'no'
			? fnum('0')
			: increase_by_ratio({
				value: subtotal,
				ratio: cost_increase_ratio_for_fence({ fence }),
			})

	const not_adjacent_to_street_increase = adjacent_to_street_or_alley
		? fnum('0')
		: increase_by_ratio({
			value: subtotal,
			ratio: fnum('0.3'),
		})

	const total = subtotal
		.plus(branches_over_something_increase)
		.plus(fence_increase)
		.plus(not_adjacent_to_street_increase)

	return total
}

const base_price_by_diameter = ({
	tree_diameter,
}: {
	tree_diameter: TreeDiameter
}) => {
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
	if (branches_over_something === 'some branches over something') return fnum('0.15')
	if (branches_over_something === 'all big branches are over something') return fnum('0.4')

	branches_over_something satisfies 'nothing underneath'
	throw new Error(`Unexpected branches_over_something value: ${branches_over_something}`)
}

const cost_increase_ratio_for_fence = ({
	fence,
}: {
	fence: Fence
}) => {
	if (fence === 'single gate') return fnum('0.25')
	if (fence === 'double gate') return fnum('0.1')

	fence satisfies 'no'
	throw new Error(`Unexpected fence value: ${fence}`)
}
