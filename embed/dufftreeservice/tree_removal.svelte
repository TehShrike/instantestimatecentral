<svelte:options customElement="tree-removal" />

<script lang="ts">
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import TreeRemovalForm, { default_data } from './forms/tree_removal_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import type { TreeRemovalPricingArguments } from '#pricing/dufftreeservice/tree_removal.ts'

	let pricing_args = $state<TreeRemovalPricingArguments>(default_data)

	const on_submit = (contact: ContactFormData<string>, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: 'tree_removal',
			pricing_args,
			contact,
			turnstile_token,
		})
</script>

<PricingWrapper>
	<TreeRemovalForm bind:pricing_args />

	<ContactForm submit={on_submit} />
</PricingWrapper>
