<script lang="ts" module>
	declare const __API_HOST__: string

	type AltchaState = 'unverified' | 'verifying' | 'verified' | 'error' | 'expired'

	interface AltchaStateChangeDetail {
		state: AltchaState
		payload?: string
	}
</script>

<script lang="ts">
	import 'altcha'

	let {
		payload = $bindable(null),
	}: {
		payload?: string | null
	} = $props()

	const handle_state_change = (event: CustomEvent<AltchaStateChangeDetail>) => {
		if (event.detail.state === 'verified' && event.detail.payload) {
			payload = event.detail.payload
		} else if (event.detail.state === 'error' || event.detail.state === 'expired') {
			payload = null
		}
	}
</script>

<altcha-widget
	challengeurl={`${__API_HOST__}/altcha_challenge`}
	onstatechange={handle_state_change}
	auto="onsubmit"
></altcha-widget>

<style>
	altcha-widget {
		display: block;

		:global(.altcha) {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.75rem;
			border: 1px solid #bdc3c7;
			border-radius: 4px;
			background: #f9f9f9;
		}

		:global(.altcha-main) {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		:global(.altcha-checkbox) {
			display: flex;
			align-items: center;
		}

		:global(.altcha-checkbox input[type='checkbox']) {
			width: 1.25rem;
			height: 1.25rem;
			cursor: pointer;
		}

		:global(.altcha-label) {
			font-size: 0.9rem;
			color: #2c3e50;
			cursor: pointer;
			flex: 1;
		}

		:global(.altcha-logo) {
			display: flex;
			align-items: center;
			color: #95a5a6;
		}

		:global(.altcha-logo:hover) {
			color: #7f8c8d;
		}

		:global(.altcha-logo svg) {
			width: 1.25rem;
			height: 1.25rem;
		}

		:global(.altcha-footer) {
			font-size: 0.75rem;
			color: #95a5a6;
		}

		:global(.altcha-footer a) {
			color: #7f8c8d;
			text-decoration: none;
		}

		:global(.altcha-footer a:hover) {
			text-decoration: underline;
		}
	}
</style>
