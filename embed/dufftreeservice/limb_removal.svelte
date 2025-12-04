<svelte:options customElement="limb-removal" />

<script lang="ts">
	import PricingWrapper from '#lib/components/pricing_wrapper.svelte'
	import ContactForm from '#lib/components/form/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/components/form/contact_form.d.ts'
	import LimbRemovalForm from './forms/limb_removal_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import { services } from '#companies/dufftreeservice/index.ts'
	import { get_limb_removal_initial_args } from './get_initial_args.ts'

	const service = services.limb_removal

	let pricing_args = $state(get_limb_removal_initial_args())

	const on_submit = (contact: ContactFormData, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: 'limb_removal',
			pricing_args,
			contact,
			turnstile_token,
		})
</script>

<PricingWrapper>
	<LimbRemovalForm pricing={service.pricing} bind:pricing_args />

	<ContactForm submit={on_submit} />
</PricingWrapper>
