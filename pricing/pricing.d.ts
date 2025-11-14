export type PricingLogic<T> = {
	pricing: (args: T) => FinancialNumber
	validator: Validator<T>
}

export type ServicePricingMap = {
	services: {
		[service_name: string]: PricingLogic<any>
	}
	service_name_validator: Validator<keyof services>
}

export type DomainNameToPricing = {
	[domain_name: string]: ServicePricingMap
}
