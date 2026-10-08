import { futch, post as futch_post } from '#lib/futch.ts'

declare const __API_HOST__: string

export const fetch_from_executor = (path: string, options?: RequestInit) => {
	return futch(`${__API_HOST__}${path}`, options)
}

export const post = (path: string, body: any) => {
	return futch_post(`${__API_HOST__}${path}`, body)
}
