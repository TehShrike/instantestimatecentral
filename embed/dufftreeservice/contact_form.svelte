<svelte:options customElement="contact-form" />

<script lang="ts">
	import { slide } from 'svelte/transition'
	import PricingWrapper from '#lib/components/pricing_wrapper.svelte'
	import ContactForm from '#lib/components/form/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/components/form/contact_form.d.ts'
	import { post } from './forms/fetch_executor.ts'

	const on_submit = (contact: ContactFormData, altcha_payload: string | null) =>
		post('/send_contact_email', {
			contact,
			altcha_payload,
		})
</script>

<PricingWrapper>
	<div in:slide={{ duration: 100 }}>
		<ContactForm submit={on_submit} />
	</div>
</PricingWrapper>
