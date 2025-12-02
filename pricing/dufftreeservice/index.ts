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

const contact_validator = jv.object({
	name: jv.is_string,
	email: jv.is_string,
	phone: jv.is_string,
	street_address: jv.is_string,
	extra: jv.object_values(jv.is_string),
})

export type ServiceProgrammaticName = keyof typeof services
export type ContactForm = jv.InferValidator<typeof contact_validator>

const company: Company<ServiceProgrammaticName, typeof services, ContactForm> = {
	services,
	service_name_validator,
	company_name: 'Duff Tree Service',
	recipient_email_address: ['andrew@dufftreeservice.com', 'josh@instantestimatecentral.com'],
	contact_validator: contact_validator,
	render_subject: (service, estimate) => `🌲💰${estimate.toString(0)}$🌳 ${service.service_name} estimate request`,
	render_html: ({ service, contact, price, estimate_arguments }) => `
	<h2>New Estimate Request</h2>
	<p><strong>Service:</strong> ${service.service_name}</p>
	<p><strong>Estimated Price:</strong> $${price.toString(0)}</p>
	<br>
	<h3>Contact Information</h3>
	<p><strong>Name:</strong> ${contact.name}</p>
	<p><strong>Email:</strong> ${contact.email}</p>
	<p><strong>Phone:</strong> ${contact.phone}</p>
	<p><strong>Address:</strong> ${contact.street_address}</p>
	${Object.entries(contact.extra)
		.map(
			([key, value]) => `
			<p><strong>${key}:</strong> ${value}</p>
		`,
		)
		.join('')}
	<br>
	<hr>
	<br>
	${service.render_html(estimate_arguments)}

`,
}

export default company
