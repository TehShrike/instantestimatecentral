export type Service<EstimateArgs> = {
	pricing: (args: EstimateArgs) => FinancialNumber
	validator: Validator<EstimateArgs>
	service_name: string
	render_html: (estimate_arguments: EstimateArgs) => string
}

export type ServiceNameToService<ServiceName extends string, ServiceArgs> = {
	[service_name in ServiceName]: Service<ServiceArgs>
}

type EstimateArguments<Service extends Service<any>> = jv.InferValidator<typeof services[ServiceName]['validator']>

export type Company<
	ServiceName extends string,
	Services extends {
		[service_name in ServiceName]: Service<any>
	},
	ContactForm
> = {
	services: Services
	service_name_validator: Validator<ServiceName>
	company_name: string
	recipient_email_address: string | string[]
	contact_validator: Validator<ContactForm>
	render_subject: <SN extends ServiceName>(service: Services[SN], estimate: FinancialNumber) => string
	render_html:<SN extends ServiceName>({service, contact, price, estimate_arguments}: {service: Services[SN], contact: ContactForm, price: FinancialNumber, estimate_arguments: EstimateArguments<Services[SN]>}) => string
}

export type DomainNameToCompany = {
	[domain_name: string]: Company
}
