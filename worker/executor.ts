import domain_to_company_map, { domain_validator } from '#companies/index.ts'
import pipeline, { Result } from './effecty_middleware.ts'
import { route } from './effecty_router.ts'
import { response, json_response, error_response } from './response_helpers.ts'
import type { Env } from './environment.ts'
import { createChallenge } from 'altcha-lib'
import send_estimate_email from './endpoints/send_estimate_email.ts'
import send_contact_email from './endpoints/send_contact_email.ts'

const ALTCHA_MAX_NUMBER = 100_000
const ALTCHA_EXPIRATION_SECONDS = 5 * 60

const handle_request = async (
	request: Request,
	env: Env,
): Promise<Result<Response, Response | { message: string; stack?: string | null }, Response>> => {
	const initial_context = { request, env, url: new URL(request.url) }

	console.log('Handling request, method:', request.method, 'url:', request.url)

	return pipeline(
		initial_context,
		async (context) => {
			const request_origin = context.request.headers.get('Origin')
			if (!request_origin) {
				console.warn('Missing Origin header')
				return Result.failure(error_response({ message: 'Missing Origin header' }))
			}

			const domain = new URL(request_origin).hostname

			if (!domain_validator.is_valid(domain)) {
				console.warn('Invalid domain:', domain)
				return Result.failure(error_response({ message: `Invalid domain: ${domain}` }))
			}

			const company = domain_to_company_map[domain]

			return Result.success({ ...context, company })
		},
		(context) => {
			if (context.request.method === 'OPTIONS') {
				return Result.interrupt(response({ status: 204 }))
			}

			return Result.success(context)
		},
		async (context) => {
			if (context.request.method === 'GET') {
				return Result.success({ ...context, body: null })
			}

			try {
				const body = await request.json()

				return Result.success({ ...context, body })
			} catch (e) {
				return Result.failure(error_response({ message: 'Invalid JSON' }))
			}
		},
		(context) => {
			return route(
				{
					'/altcha_challenge': {
						GET: async ({ env }) => {
							const expires = new Date(Date.now() + ALTCHA_EXPIRATION_SECONDS * 1000)
							const challenge = await createChallenge({
								hmacKey: env.ALTCHA_HMAC_KEY,
								maxNumber: ALTCHA_MAX_NUMBER,
								expires,
							})
							return Result.success(json_response({ body: challenge, status: 200 }))
						},
					},
					'/send_estimate_email': {
						POST: send_estimate_email,
					},
					'/send_contact_email': {
						POST: send_contact_email,
					},
				},
				context.url.pathname,
				context.request.method,
				context,
			)
		},
	)
}

export default handle_request
