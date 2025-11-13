export type PricingLogic<T> = {
	pricing: (args: T) => FinancialNumber
	validator: Validator<T>
}

export type ServicePricingMap = {
	[key: string]: PricingLogic<any>
}

export type DomainNameToPricing = {
	[key: string]: ServicePricingMap
}
