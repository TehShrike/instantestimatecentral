<svelte:options customElement="tree-planting" />

<script lang="ts">
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import TreePlantingForm, { additional_contact_form_fields } from './forms/tree_planting_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import { services } from '#pricing/dufftreeservice/index.ts'
	import { get_tree_planting_initial_args } from './get_initial_args.ts'

	const service = services.tree_planting

	let pricing_args = $state(get_tree_planting_initial_args())

	const on_submit = (contact: ContactFormData, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: 'tree_planting',
			pricing_args,
			contact,
			turnstile_token,
		})
</script>

<PricingWrapper>
	<TreePlantingForm pricing={service.pricing} bind:pricing_args />

	<ContactForm submit={on_submit} additional_fields={additional_contact_form_fields} />
</PricingWrapper>
