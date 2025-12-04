export type ContactForm<FieldName extends string = string> = {
	name: string
	email: string
	phone: string
	street_address: string
	extra: {
		[key in FieldName]: string
	}
}
