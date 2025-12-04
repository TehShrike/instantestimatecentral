import { post } from './forms/fetch_executor.ts'
import type { ContactForm } from '#lib/contact_form.d.ts'
import { type ServiceProgrammaticName, services } from '#companies/dufftreeservice/index.ts'
import type { EstimateArguments } from '#companies/companies.js'

const send_estimate_email = <Service extends ServiceProgrammaticName, FieldName extends string>({
	service_name,
	pricing_args,
	contact,
	turnstile_token,
}: {
	service_name: Service
	pricing_args: EstimateArguments<(typeof services)[Service]>
	contact: ContactForm<FieldName>
	turnstile_token: string | null
}) =>
	post('/send_estimate_email', {
		service: service_name,
		args: pricing_args,
		contact,
		turnstile_token,
	})

export default send_estimate_email
