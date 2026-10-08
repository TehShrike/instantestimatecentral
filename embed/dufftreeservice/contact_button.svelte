<svelte:options customElement="contact-button" />

<script lang="ts">
	import { slide } from 'svelte/transition'
	import PricingWrapper from '#lib/components/pricing_wrapper.svelte'
	import Button from '#lib/components/button.svelte'
	import ContactForm from '#lib/components/form/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/components/form/contact_form.d.ts'
	import { post } from './forms/fetch_executor.ts'

	let { call_to_action = 'Contact us' }: { call_to_action?: string } = $props()

	let show_form = $state(false)

	const on_submit = (contact: ContactFormData, altcha_payload: string | null) =>
		post('/send_contact_email', {
			contact,
			altcha_payload,
		})
</script>

<PricingWrapper>
	{#if !show_form}
		<div out:slide={{ duration: 100 }} style="display: flex; justify-content: center;">
			<Button onclick={() => (show_form = true)}>
				{call_to_action}
			</Button>
		</div>
	{/if}

	{#if show_form}
		<div in:slide={{ duration: 100 }}>
			<ContactForm submit={on_submit} />
		</div>
	{/if}
</PricingWrapper>
