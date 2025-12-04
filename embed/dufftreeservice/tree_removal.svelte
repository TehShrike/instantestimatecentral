<svelte:options customElement="tree-removal" />

<script lang="ts">
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import TreeRemovalForm from './forms/tree_removal_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import { services } from '#companies/dufftreeservice/index.ts'
	import { get_tree_removal_initial_args } from './get_initial_args.ts'

	const service = services.tree_removal

	let pricing_args = $state(get_tree_removal_initial_args())

	const on_submit = (contact: ContactFormData<string>, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: 'tree_removal',
			pricing_args,
			contact,
			turnstile_token,
		})
</script>

<PricingWrapper>
	<TreeRemovalForm pricing={service.pricing} bind:pricing_args />

	<ContactForm submit={on_submit} />
</PricingWrapper>
