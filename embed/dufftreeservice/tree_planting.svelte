<svelte:options customElement="tree-planting" />

<script lang="ts">
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import TreePlantingForm, { additional_contact_form_fields, default_data } from './forms/tree_planting_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import type { TreePlantingPricingArguments } from '#pricing/dufftreeservice/tree_planting.ts'

	let pricing_args = $state<TreePlantingPricingArguments>(default_data)

	const on_submit = (contact: ContactFormData, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: 'tree_planting',
			pricing_args,
			contact,
			turnstile_token,
		})
</script>

<PricingWrapper>
	<TreePlantingForm bind:pricing_args />

	<ContactForm submit={on_submit} additional_fields={additional_contact_form_fields} />
</PricingWrapper>
