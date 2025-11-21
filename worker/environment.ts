export interface Env {
	ASSETS: Fetcher
	RESEND_API_KEY: string
	ENVIRONMENT: 'local' | 'production'
	CF_TURNSTILE_SECRET_KEY: string
}

export const determine_embed_origin = (environment: Env['ENVIRONMENT']): string => {
	return environment === 'local'
		? 'https://embed.local.com:1337'
		: 'https://embed.instantestimatecentral.com'
}
