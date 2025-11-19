<svelte:options customElement="all-services" />

<script lang="ts">
	import Tabs from '#lib/tabs.svelte'
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import { get, set } from '#lib/localstorage.ts'
	import { is_string } from '#lib/json_validator.ts'
	import LimbRemovalForm from './forms/limb_removal_form.svelte'
	import TreeRemovalForm from './forms/tree_removal_form.svelte'
	import TreeTrimmingForm from './forms/tree_trimming_form.svelte'
	import TreePlantingForm from './forms/tree_planting_form.svelte'

	let current_tab = $state(get('all_services_current_tab', is_string, 'Limb Removal'))

	$effect(() => set('all_services_current_tab', current_tab))
</script>

<PricingWrapper>
	<Tabs
		bind:current_tab
		tabs={[
			{
				name: 'Limb Removal',
				content: limb_removal_content,
			},
			{
				name: 'Tree Removal',
				content: tree_removal_content,
			},
			{
				name: 'Tree Trimming',
				content: tree_trimming_content,
			},
			{
				name: 'Tree Planting',
				content: tree_planting_content,
			},
		]}
	/>
</PricingWrapper>

{#snippet limb_removal_content()}
	<LimbRemovalForm />
{/snippet}

{#snippet tree_removal_content()}
	<TreeRemovalForm />
{/snippet}

{#snippet tree_trimming_content()}
	<TreeTrimmingForm />
{/snippet}

{#snippet tree_planting_content()}
	<TreePlantingForm />
{/snippet}
