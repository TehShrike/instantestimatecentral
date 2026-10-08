<svelte:options customElement="tree-planting" />

<script lang="ts">
	import PricingWrapper from '#lib/components/pricing_wrapper.svelte'
	import ContactForm from '#lib/components/form/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/components/form/contact_form.d.ts'
	import TreePlantingForm, { additional_contact_form_fields } from './forms/tree_planting_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import { services } from '#companies/dufftreeservice/index.ts'
	import { get_tree_planting_initial_args } from './get_initial_args.ts'

	const service = services.tree_planting

	let pricing_args = $state(get_tree_planting_initial_args())

	const on_submit = (contact: ContactFormData, altcha_payload: string | null) =>
		send_estimate_email({
			service_name: 'tree_planting',
			pricing_args,
			contact,
			altcha_payload,
		})
</script>

<PricingWrapper>
	<TreePlantingForm pricing={service.pricing} bind:pricing_args />

	<ContactForm submit={on_submit} additional_fields={additional_contact_form_fields} />
</PricingWrapper>
