import limb_removal from './limb_removal.ts'
import tree_removal from './tree_removal.ts'
import tree_trimming from './tree_trimming.ts'
import tree_planting from './tree_planting.ts'
import { type Company, type ServiceNameToService, type Service } from '#pricing/pricing.js'
import object_key_validator from '#lib/object_key_validator.ts'
import { type FinancialNumber } from 'financial-number'
import * as jv from '#lib/json_validator.ts'

export const services = {
	limb_removal,
	tree_removal,
	tree_trimming,
	tree_planting,
} as const satisfies ServiceNameToService<string, any>

export const service_name_validator = object_key_validator(services)

type ServiceProgrammaticName = keyof typeof services
type DuffTreeServices = typeof services[ServiceProgrammaticName]
type ServicePricingArguments = {
	[service_name in ServiceProgrammaticName]: jv.InferValidator<typeof services[service_name]['validator']>
}

type DuffTreeServiceEstimateArguments<ServiceName extends ServiceProgrammaticName> = jv.InferValidator<typeof services[ServiceName]['validator']>

const contact_validator = jv.object({
	name: jv.is_string,
	email: jv.is_string,
	phone: jv.is_string,
	street_address: jv.is_string,
	extra: jv.object_values(jv.is_string),
})

type ContactForm = jv.InferValidator<typeof contact_validator>

const company: Company<ServiceProgrammaticName, typeof services, ContactForm> = {
	services,
	service_name_validator,
	company_name: 'Duff Tree Service',
	recipient_email_address: 'me@joshduff.com',
	contact_validator: contact_validator,
	render_subject: (service: DuffTreeServices, estimate: FinancialNumber) => `🌲 💲${estimate.toString(0)} 🌳 New ${service.service_name} estimate request`,
	render_html: ({service, contact, price, estimate_arguments}) => (service as Service<DuffTreeServiceEstimateArguments<ServiceProgrammaticName>>).render_html(estimate_arguments),
} as const

export default company
