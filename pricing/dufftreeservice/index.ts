import * as limb_removal from './limb_removal.ts'
import * as tree_removal from './tree_removal.ts'
import * as tree_trimming from './tree_trimming.ts'
import * as tree_planting from './tree_planting.ts'
import { type ServicePricingMap } from '#pricing/pricing.js'
import { type Validator } from '#lib/json_validator.ts'

export const services = {
	limb_removal,
	tree_removal,
	tree_trimming,
	tree_planting,
} as const satisfies ServicePricingMap['services']

export const service_name_validator: Validator<keyof typeof services> = {
	is_valid: (input): input is keyof typeof services => typeof input === 'string' && input in services,
	get_messages: (input, name) => {
		if (typeof input !== 'string') {
			return [ `${ name } should be a string` ]
		}
		if (!(input in services)) {
			return [ `${ name } should be one of ${ Object.keys(services).map(key => `"${ key }"`).join(', ') }` ]
		}
		return []
	},
}

export default {
	services,
	service_name_validator,
} as const satisfies ServicePricingMap

