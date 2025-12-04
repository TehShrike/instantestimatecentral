import { get } from '#lib/localstorage.ts'
import { services } from '#companies/dufftreeservice/index.ts'

export const get_limb_removal_initial_args = () =>
	get('limb_removal_data', services.limb_removal.validator, services.limb_removal.default_pricing_args)

export const get_tree_removal_initial_args = () =>
	get('tree_removal_data', services.tree_removal.validator, services.tree_removal.default_pricing_args)

export const get_tree_trimming_initial_args = () =>
	get('tree_trimming_data', services.tree_trimming.validator, services.tree_trimming.default_pricing_args)

export const get_tree_planting_initial_args = () =>
	get('tree_planting_data', services.tree_planting.validator, services.tree_planting.default_pricing_args)
