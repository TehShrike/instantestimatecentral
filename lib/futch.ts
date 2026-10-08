const JSON_CONTENT_TYPE = 'application/json'

type FutchOptions = RequestInit & { body?: any }

const build_init = (options: FutchOptions) => {
	const has_body = 'body' in options && options.body !== undefined
	const headers = has_body
		? {
				'content-type': JSON_CONTENT_TYPE,
				...options.headers,
			}
		: options.headers || {}

	const init = {
		method: options.method || `GET`,
		headers,
	}

	if (has_body) {
		return {
			...init,
			body: JSON.stringify(options.body),
		}
	}

	return init
}

export const futch = async (url: string, options: FutchOptions = {}) => {
	const init = build_init(options)
	const response = await fetch(url, init)

	if (!response.ok) {
		console.error('futch error', url, response.status, response.statusText)
		return Promise.reject(response)
	}

	if (response.headers.get('content-type')?.includes(JSON_CONTENT_TYPE)) {
		return response.json()
	}

	return response.text()
}

export const post = (url: string, body: any) => futch(url, { method: `POST`, body })
