export type PricingLogic<T> = {
	pricing: (args: T) => FinancialNumber
	validator: Validator<T>
}

export type ServicePricingMap<T> = {
	[key: string]: PricingLogic<T>
}

export type DomainNameToPricing<T> = {
	[key: string]: ServicePricingMap<T>
}
