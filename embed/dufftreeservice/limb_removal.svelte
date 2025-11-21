<svelte:options customElement="limb-removal" />

<script lang="ts">
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import LimbRemovalForm, { default_data } from './forms/limb_removal_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import type { LimbRemovalPricingArguments } from '#pricing/dufftreeservice/limb_removal.ts'

	let pricing_args = $state<LimbRemovalPricingArguments>(default_data)

	const on_submit = (contact: ContactFormData, turnstile_token: string | null) => send_estimate_email({
		service_name: 'limb_removal',
		pricing_args,
		contact,
		turnstile_token,
	})
</script>

<PricingWrapper>
	<LimbRemovalForm bind:pricing_args />

	<ContactForm submit={on_submit} />
</PricingWrapper>
