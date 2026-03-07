import executor_handle_request from './executor.ts'
import { is_success, is_interrupt } from './effecty_middleware.ts'
import { error_response, error_to_string } from './response_helpers.ts'
import type { Env } from './environment.ts'

const prepend_path = (request: Request, path_prefix: string): Request => {
	const url = new URL(request.url)
	url.pathname = `${path_prefix}${url.pathname}`

	return new Request(url.toString(), new Request(request))
}

const get_subdomain = (hostname: string): string => {
	const parts = hostname.split('.')
	return parts.length > 2 ? (parts[0] ?? '') : ''
}

const with_cache_headers = (response: Response): Response => {
	const cached_response = new Response(response.body, response)
	cached_response.headers.set('Cache-Control', 'public, max-age=43200')
	return cached_response
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)
		const subdomain = get_subdomain(url.hostname)

		console.log('🔆 worker running, subdomain:', subdomain, 'full url:', url.toString())

		if (url.hostname === 'instantestimatecentral.pages.dev') {
			const redirectUrl = `https://www.instantestimatecentral.com${url.pathname}${url.search}${url.hash}`
			return Response.redirect(redirectUrl, 301)
		}

		if (subdomain === 'executor') {
			const result = await executor_handle_request(request, env)
			if (is_success(result) || is_interrupt(result)) {
				return result.value
			}

			if (result.value instanceof Response) {
				return result.value
			} else {
				console.error('Error in executor:', result.value)
				return error_response({ ...error_to_string(result.value), status: 500 })
			}
		}

		if (subdomain === 'embed') {
			return with_cache_headers(await env.ASSETS.fetch(prepend_path(request, '/embed')))
		}

		console.log('🍏 redirecting to ASSETS binding', prepend_path(request, '/www').url)

		return with_cache_headers(await env.ASSETS.fetch(prepend_path(request, '/www')))
	},
}
