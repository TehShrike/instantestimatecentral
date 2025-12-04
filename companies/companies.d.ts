export type PricingResult = {
	original_price: FinancialNumber
	rounded_original_price: FinancialNumber
	price_after_inflation: FinancialNumber
	rounded_price_after_inflation: FinancialNumber
}

export type PricingFunction<Args> = (args: Args) => PricingResult

export type Service<EstimateArgs> = {
	pricing: PricingFunction<EstimateArgs>
	validator: Validator<EstimateArgs>
	service_name: string
	render_html: (estimate_arguments: EstimateArgs) => string
	default_pricing_args: EstimateArgs
}

export type ServiceNameToService<ServiceName extends string, ServiceArgs> = {
	[service_name in ServiceName]: Service<ServiceArgs>
}

type EstimateArguments<Service extends Service<any>> = jv.InferValidator<(typeof services)[ServiceName]['validator']>

export type Company<
	ServiceName extends string,
	Services extends {
		[service_name in ServiceName]: Service<any>
	},
	ContactForm,
> = {
	services: Services
	service_name_validator: Validator<ServiceName>
	company_name: string
	recipient_email_address: string | string[]
	contact_validator: Validator<ContactForm>
	render_subject: <SN extends ServiceName>(service: Services[SN], price: PricingResult) => string
	render_html: <SN extends ServiceName>({
		service,
		contact,
		price,
		estimate_arguments,
	}: {
		service: Services[SN]
		contact: ContactForm
		price: PricingResult
		estimate_arguments: EstimateArguments<Services[SN]>
	}) => string
}

export type DomainNameToCompany = {
	[domain_name: string]: Company
}
