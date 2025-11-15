import fnum from '#lib/fnum.ts'
import { exact, is_number, object, one_of, type Validator } from '#lib/json_validator.ts'
import type { FinancialNumber } from 'financial-number'

export const service_name = 'Tree Planting'

type TreeSize = '1 gallon' | '3 gallons' | '7 gallons' | '15 gallons'

export type TreePlantingPricingArguments = {
	tree_size: TreeSize
	number_of_trees: number
}

export const pricing = ({
	tree_size,
	number_of_trees,
}: TreePlantingPricingArguments): FinancialNumber => {
	const base_price_per_tree = get_base_price_per_tree(tree_size)
	const discount_ratio = get_discount_ratio(number_of_trees)

	const total = base_price_per_tree
		.times(fnum(number_of_trees.toString()))
		.times(fnum('1').minus(discount_ratio))

	return total
}

const get_base_price_per_tree = (tree_size: TreeSize): FinancialNumber => {
	const price_map: Record<TreeSize, string> = {
		'1 gallon': '100',
		'3 gallons': '186',
		'7 gallons': '435',
		'15 gallons': '705',
	}

	return fnum(price_map[tree_size])
}

const get_discount_ratio = (number_of_trees: number): FinancialNumber => {
	if (number_of_trees === 1) return fnum('0')
	if (number_of_trees === 2) return fnum('0.12')
	if (number_of_trees === 3) return fnum('0.18')
	if (number_of_trees === 4) return fnum('0.21')
	if (number_of_trees === 5) return fnum('0.22')
	if (number_of_trees >= 6) return fnum('0.23')

	return fnum('0')
}

const tree_size_validator: Validator<TreePlantingPricingArguments['tree_size']> = one_of(
	exact('1 gallon' as const),
	exact('3 gallons' as const),
	exact('7 gallons' as const),
	exact('15 gallons' as const),
)

export const validator: Validator<TreePlantingPricingArguments> = object({
	tree_size: tree_size_validator,
	number_of_trees: is_number,
})

export const render_html = (args: TreePlantingPricingArguments) => {
	return `
		<h2>${service_name}</h2>
		<p>Tree size: <strong>${args.tree_size}</strong></p>
		<p>Number of trees: <strong>${args.number_of_trees}</strong></p>
	`
}

export default {
	pricing,
	validator,
	service_name,
	render_html,
} as const
