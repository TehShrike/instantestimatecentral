<svelte:options customElement="all-services" />

<script lang="ts">
	import Tabs, { type Tab } from '#lib/components/tabs.svelte'
	import PricingWrapper from '#lib/components/pricing_wrapper.svelte'
	import ContactForm, { type AdditionalField } from '#lib/components/form/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/components/form/contact_form.d.ts'
	import { get, set } from '#lib/localstorage.ts'
	import LimbRemovalForm from './forms/limb_removal_form.svelte'
	import TreeRemovalForm from './forms/tree_removal_form.svelte'
	import TreeTrimmingForm from './forms/tree_trimming_form.svelte'
	import TreePlantingForm, {
		additional_contact_form_fields as tree_planting_additional_contact_form_fields,
	} from './forms/tree_planting_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import {
		get_limb_removal_initial_args,
		get_tree_removal_initial_args,
		get_tree_trimming_initial_args,
		get_tree_planting_initial_args,
	} from './get_initial_args.ts'
	import { services, service_name_validator, type ServiceProgrammaticName } from '#companies/dufftreeservice/index.ts'
	import VerticalColumnWithGap from '#lib/components/vertical_column_with_gap.svelte'

	const additional_contact_form_fields: Partial<Record<ServiceProgrammaticName, AdditionalField<string>[]>> = {
		tree_planting: tree_planting_additional_contact_form_fields,
	} as const

	const tabs: Tab<ServiceProgrammaticName>[] = [
		{
			name: 'Limb Removal',
			content: limb_removal_content,
			identifier: 'limb_removal',
		},
		{
			name: 'Tree Removal',
			content: tree_removal_content,
			identifier: 'tree_removal',
		},
		{
			name: 'Tree Trimming',
			content: tree_trimming_content,
			identifier: 'tree_trimming',
		},
		{
			name: 'Tree Planting',
			content: tree_planting_content,
			identifier: 'tree_planting',
		},
	]

	let current_tab_identifier = $state<ServiceProgrammaticName>(
		get('all_services_current_tab_identifier', service_name_validator, 'limb_removal'),
	)

	let pricing_args = $state({
		limb_removal: get_limb_removal_initial_args(),
		tree_removal: get_tree_removal_initial_args(),
		tree_trimming: get_tree_trimming_initial_args(),
		tree_planting: get_tree_planting_initial_args(),
	})

	const on_submit = (contact: ContactFormData<string>, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: current_tab_identifier,
			pricing_args: pricing_args[current_tab_identifier],
			contact,
			turnstile_token,
		})

	$effect(() => set('all_services_current_tab_identifier', current_tab_identifier))
</script>

<PricingWrapper>
	<Tabs bind:current_tab_identifier {tabs} />
	<ContactForm submit={on_submit} additional_fields={additional_contact_form_fields[current_tab_identifier] || []} />
</PricingWrapper>

{#snippet limb_removal_content()}
	<VerticalColumnWithGap>
		<LimbRemovalForm pricing={services.limb_removal.pricing} bind:pricing_args={pricing_args.limb_removal} />
	</VerticalColumnWithGap>
{/snippet}

{#snippet tree_removal_content()}
	<VerticalColumnWithGap>
		<TreeRemovalForm pricing={services.tree_removal.pricing} bind:pricing_args={pricing_args.tree_removal} />
	</VerticalColumnWithGap>
{/snippet}

{#snippet tree_trimming_content()}
	<VerticalColumnWithGap>
		<TreeTrimmingForm pricing={services.tree_trimming.pricing} bind:pricing_args={pricing_args.tree_trimming} />
	</VerticalColumnWithGap>
{/snippet}

{#snippet tree_planting_content()}
	<VerticalColumnWithGap>
		<TreePlantingForm pricing={services.tree_planting.pricing} bind:pricing_args={pricing_args.tree_planting} />
	</VerticalColumnWithGap>
{/snippet}
