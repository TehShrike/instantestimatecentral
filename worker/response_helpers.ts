const cors_headers = {
	'Access-Control-Allow-Origin': 'https://embed.instantestimatecentral.com',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
}

export const response = ({ body = null, status, headers = {} }: { body?: string | null, status: number, headers?: Record<string, string> }) => new Response(body, {
	status,
	headers: { ...cors_headers, ...headers },
})

export const json_response = ({ body, status, headers = {} }: { body: any, status: number, headers?: Record<string, string> }) => response({
	body: JSON.stringify(body),
	status,
	headers: { 'Content-Type': 'application/json', ...headers }
})

export const error_response = ({ message, status = 400, headers = {} }: { message: string, status?: number, headers?: Record<string, string> }) => json_response({
	body: { error: message },
	status,
	headers,
})

export const error_to_string = (error: unknown): { message: string, stack: string | null } => {
	if (error instanceof Error) {
		return { message: error.message, stack: error.stack ?? '' }
	}
	return { message: String(error), stack: null }
}

