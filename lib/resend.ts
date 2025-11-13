type ResendEmailRequest = {
	from: string
	to: string[]
	subject: string
	html: string
	reply_to?: string
}

type ResendEmailResponse = {
	id: string
}

type ResendError = {
	message: string
	name: string
}

export const send_email = async ({
	api_key,
	from,
	to,
	subject,
	html,
	reply_to,
}: ResendEmailRequest & { api_key: string }): Promise<ResendEmailResponse> => {
	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${api_key}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from,
			to,
			subject,
			html,
			reply_to,
		}),
	})

	if (!response.ok) {
		const error_data = (await response.json()) as ResendError
		throw new Error(`Resend API error: ${error_data.name} - ${error_data.message}`)
	}

	return (await response.json()) as ResendEmailResponse
}
