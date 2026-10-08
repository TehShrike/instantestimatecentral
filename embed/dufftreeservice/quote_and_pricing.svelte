<svelte:options customElement="quote-and-pricing" />

<script lang="ts">
	import { slide } from 'svelte/transition'
	import PricingWrapper from '#lib/components/pricing_wrapper.svelte'
	import Button from '#lib/components/button.svelte'
	import ContactForm from '#lib/components/form/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/components/form/contact_form.d.ts'
	import AllServicesWithTabsAndContactForm from './forms/all_services_with_tabs_and_contact_form.svelte'
	import { post } from './forms/fetch_executor.ts'

	let { size = 1 }: { size?: number } = $props()

	type ActiveView = 'quote' | 'pricing'

	let active_view = $state<ActiveView | null>(null)
	let should_animate = $state(true)

	const set_view = (view: ActiveView) => {
		should_animate = active_view === null
		active_view = view
	}

	const on_contact_submit = (contact: ContactFormData, altcha_payload: string | null) =>
		post('/send_contact_email', {
			contact,
			altcha_payload,
		})
</script>

<PricingWrapper>
	<div style="display: flex; justify-content: center; gap: 1rem;">
		<Button onclick={() => set_view('quote')} style="font-size: {size}em;">Get a quote</Button>
		<Button
			onclick={() => set_view('pricing')}
			style="--button_background_color_override: var(--iec_secondary_color); font-size: {size}em;"
		>
			Pricing
		</Button>
	</div>

	{#if active_view}
		<div in:slide={{ duration: should_animate ? 100 : 0 }}>
			{#if active_view === 'quote'}
				<ContactForm submit={on_contact_submit} />
			{:else}
				<AllServicesWithTabsAndContactForm initial_tab_identifier="limb_removal" />
			{/if}
		</div>
	{/if}
</PricingWrapper>
