<script lang="ts" module>
	declare const __CF_TURNSTILE_SITE_KEY__: string

	interface TurnstileAPI {
		render: (container: string | HTMLElement, options: {
			sitekey: string
			callback?: (token: string) => void
			'error-callback'?: () => void
			'expired-callback'?: () => void
			theme?: 'light' | 'dark' | 'auto'
			size?: 'normal' | 'compact' | 'flexible'
		}) => string
		reset: (widgetId: string) => void
		remove: (widgetId: string) => void
		getResponse: (widgetId: string) => string | undefined
	}

	declare global {
		interface Window {
			turnstile?: TurnstileAPI
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import assert from '#lib/assert.ts'

	let {
		token = $bindable(null),
	}: {
		token?: string | null
	} = $props()

	let container: HTMLDivElement
	let widget_id: string | null = null

	const render_widget = () => {
		console.log('Rendering Turnstile widget')
		assert(window.turnstile)

		widget_id = window.turnstile.render(container, {
			sitekey: __CF_TURNSTILE_SITE_KEY__,
			callback: (response_token: string) => {
				console.log('Got back Turnstile response token', response_token)
				token = response_token
			},
			'error-callback': () => {
				token = null
			},
			'expired-callback': () => {
				token = null
			},
		})
	}

	onMount(() => {
		let interval: NodeJS.Timeout | null = null
		const check_turnstile = () => {
			if (window.turnstile) {
				render_widget()
			} else {
				interval = setTimeout(check_turnstile, 100)
			}
		}

		check_turnstile()

		return () => {
			if (widget_id && window.turnstile) {
				window.turnstile.remove(widget_id)
			}
			if (interval) {
				clearTimeout(interval)
			}
		}
	})
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
</svelte:head>

<div bind:this={container}></div>
