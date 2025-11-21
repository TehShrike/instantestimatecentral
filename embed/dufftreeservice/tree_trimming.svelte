<svelte:options customElement="tree-trimming" />

<script lang="ts">
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import TreeTrimmingForm, { default_data } from './forms/tree_trimming_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import type { TreeTrimmingPricingArguments } from '#pricing/dufftreeservice/tree_trimming.ts'

	let pricing_args = $state<TreeTrimmingPricingArguments>(default_data)

	const on_submit = (contact: ContactFormData, turnstile_token: string | null) => send_estimate_email({
		service_name: 'tree_trimming',
		pricing_args,
		contact,
		turnstile_token,
	})
</script>

<PricingWrapper>
	<TreeTrimmingForm bind:pricing_args />

	<ContactForm submit={on_submit} />
</PricingWrapper>
