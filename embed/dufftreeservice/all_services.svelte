<svelte:options customElement="all-services" />

<script lang="ts">
	import Tabs, { type Tab } from '#lib/tabs.svelte'
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm, { type AdditionalField } from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import { get, set } from '#lib/localstorage.ts'
	import LimbRemovalForm, { default_data as limb_removal_default_data } from './forms/limb_removal_form.svelte'
	import TreeRemovalForm, { default_data as tree_removal_default_data } from './forms/tree_removal_form.svelte'
	import TreeTrimmingForm, { default_data as tree_trimming_default_data } from './forms/tree_trimming_form.svelte'
	import TreePlantingForm, {
		additional_contact_form_fields as tree_planting_additional_contact_form_fields,
		default_data as tree_planting_default_data,
	} from './forms/tree_planting_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import type { LimbRemovalPricingArguments } from '#pricing/dufftreeservice/limb_removal.ts'
	import type { TreeRemovalPricingArguments } from '#pricing/dufftreeservice/tree_removal.ts'
	import type { TreeTrimmingPricingArguments } from '#pricing/dufftreeservice/tree_trimming.ts'
	import type { TreePlantingPricingArguments } from '#pricing/dufftreeservice/tree_planting.ts'
	import type { ServiceProgrammaticName } from '#pricing/dufftreeservice/index.ts'
	import { service_name_validator } from '#pricing/dufftreeservice/index.ts'
	import VerticalColumnWithGap from '#lib/vertical_column_with_gap.svelte'

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

	let pricing_args = $state<{
		limb_removal: LimbRemovalPricingArguments
		tree_removal: TreeRemovalPricingArguments
		tree_trimming: TreeTrimmingPricingArguments
		tree_planting: TreePlantingPricingArguments
	}>({
		limb_removal: limb_removal_default_data,
		tree_removal: tree_removal_default_data,
		tree_trimming: tree_trimming_default_data,
		tree_planting: tree_planting_default_data,
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
		<LimbRemovalForm bind:pricing_args={pricing_args.limb_removal} />
	</VerticalColumnWithGap>
{/snippet}

{#snippet tree_removal_content()}
	<VerticalColumnWithGap>
		<TreeRemovalForm bind:pricing_args={pricing_args.tree_removal} />
	</VerticalColumnWithGap>
{/snippet}

{#snippet tree_trimming_content()}
	<VerticalColumnWithGap>
		<TreeTrimmingForm bind:pricing_args={pricing_args.tree_trimming} />
	</VerticalColumnWithGap>
{/snippet}

{#snippet tree_planting_content()}
	<VerticalColumnWithGap>
		<TreePlantingForm bind:pricing_args={pricing_args.tree_planting} />
	</VerticalColumnWithGap>
{/snippet}
