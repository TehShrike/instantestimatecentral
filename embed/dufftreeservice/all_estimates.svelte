<svelte:options customElement="all-estimates" />

<script lang="ts">
	import Tabs from '#lib/tabs.svelte'
	import { get, set } from '#lib/localstorage.ts'
	import { is_string } from '#lib/json_validator.ts'
	import LimbRemoval from './limb_removal.svelte'
	import TreeRemoval from './tree_removal.svelte'
	import TreeTrimming from './tree_trimming.svelte'
	import TreePlanting from './tree_planting.svelte'

	let current_tab = $state(get('all_estimates_current_tab', is_string, 'Limb Removal'))

	$effect(() => set('all_estimates_current_tab', current_tab))
</script>

<div class="container">
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
</div>

{#snippet limb_removal_content()}
	<LimbRemoval />
{/snippet}

{#snippet tree_removal_content()}
	<TreeRemoval />
{/snippet}

{#snippet tree_trimming_content()}
	<TreeTrimming />
{/snippet}

{#snippet tree_planting_content()}
	<TreePlanting />
{/snippet}

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
	}

	:global(:root) {
		font-family: inherit;
		color: inherit;
	}
</style>
