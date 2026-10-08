<svelte:options customElement="all-services" />

<script lang="ts">
	import PricingWrapper from '#lib/components/pricing_wrapper.svelte'
	import AllServicesWithTabsAndContactForm from './forms/all_services_with_tabs_and_contact_form.svelte'
	import type { ServiceProgrammaticName } from '#companies/dufftreeservice/index.ts'

	let {
		disable_submit = false,
		initial_tab_identifier = null,
	}: {
		disable_submit?: boolean
		initial_tab_identifier?: ServiceProgrammaticName | null
	} = $props()
</script>

<PricingWrapper>
	<AllServicesWithTabsAndContactForm {disable_submit} {initial_tab_identifier} />
</PricingWrapper>
