import * as limb_removal from './limb_removal.ts'
import * as tree_removal from './tree_removal.ts'
import * as tree_trimming from './tree_trimming.ts'
import * as tree_planting from './tree_planting.ts'
import { type ServicePricingMap } from '#pricing/pricing.js'

const dufftreeservice: ServicePricingMap<unknown> = {
	limb_removal,
	tree_removal,
	tree_trimming,
	tree_planting,
} as const

export default dufftreeservice
