import { handle_request as executor_handle_request } from './executor.ts'

interface Env {
	ASSETS: Fetcher
	RESEND_API_KEY: string
}

const prepend_path = (request: Request, path_prefix: string): Request => {
	const url = new URL(request.url)
	url.pathname = `${path_prefix}${url.pathname}`

	return new Request(url.toString(), new Request(request))
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		if (url.hostname === 'instantestimatecentral.pages.dev') {
			const redirectUrl = `https://www.instantestimatecentral.com${url.pathname}${url.search}${url.hash}`
			return Response.redirect(redirectUrl, 301)
		}

		if (url.hostname === 'executor.instantestimatecentral.com') {
			return executor_handle_request(request, env)
		}

		if (url.hostname === 'embed.instantestimatecentral.com') {
			return env.ASSETS.fetch(prepend_path(request, '/embed'))
		}

		return env.ASSETS.fetch(prepend_path(request, '/www'))
	}
}
