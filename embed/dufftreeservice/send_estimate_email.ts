import { post } from './forms/fetch_executor.ts'
import type { ContactForm } from '#lib/components/form/contact_form.d.ts'
import { type ServiceProgrammaticName, services } from '#companies/dufftreeservice/index.ts'
import type { EstimateArguments } from '#companies/companies.js'

const send_estimate_email = <Service extends ServiceProgrammaticName, FieldName extends string>({
	service_name,
	pricing_args,
	contact,
	altcha_payload,
}: {
	service_name: Service
	pricing_args: EstimateArguments<(typeof services)[Service]>
	contact: ContactForm<FieldName>
	altcha_payload: string | null
}) =>
	post('/send_estimate_email', {
		service: service_name,
		args: pricing_args,
		contact,
		altcha_payload,
	})

export default send_estimate_email
