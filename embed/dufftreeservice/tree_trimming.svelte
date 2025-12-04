<svelte:options customElement="tree-trimming" />

<script lang="ts">
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import TreeTrimmingForm from './forms/tree_trimming_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import { services } from '#companies/dufftreeservice/index.ts'
	import { get_tree_trimming_initial_args } from './get_initial_args.ts'

	const service = services.tree_trimming

	let pricing_args = $state(get_tree_trimming_initial_args())

	const on_submit = (contact: ContactFormData, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: 'tree_trimming',
			pricing_args,
			contact,
			turnstile_token,
		})
</script>

<PricingWrapper>
	<TreeTrimmingForm pricing={service.pricing} bind:pricing_args />

	<ContactForm submit={on_submit} />
</PricingWrapper>
