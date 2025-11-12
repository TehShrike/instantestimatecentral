<svelte:options customElement="tree-planting" />

<script lang="ts">
	import { pricing, validator, type PricingArguments } from './tree_planting.ts'
	import { get, set } from '#lib/localstorage.ts'
	import NumberInput from '#lib/number_input.svelte'
	import RadioGroup from '#lib/radio_group.svelte'
	import PricingForm from '#lib/pricing_form.svelte'
	import EstimatedPriceDisplay from '#lib/estimated_price_display.svelte'

	const default_data: PricingArguments = {
		tree_size: '3 gallons',
		number_of_trees: 1,
	}

	let data = $state(get('tree_planting_data', validator, default_data))

	const calculated_price = $derived(pricing(data))

	$effect(() => set('tree_planting_data', data))

	const row_types = {
		tree_size: 'radio',
		number_of_trees: 'number',
	} as const
</script>

{#snippet number_of_trees()}
	<label class="left" for="number_of_trees">How many trees?</label>
	<NumberInput bind:value={data.number_of_trees} id="number_of_trees" min={1} max={100} />
{/snippet}

{#snippet tree_size()}
	<div class="left">How big of a tree?</div>
	<RadioGroup
		options={[
			{ label: '1 gallon (1-2 feet high)', value: '1 gallon' as const },
			{ label: '3 gallons (3-4 feet high)', value: '3 gallons' as const },
			{ label: '7 gallons (5-7 feet high)', value: '7 gallons' as const },
			{ label: '15 gallons (6-8 feet high)', value: '15 gallons' as const },
		]}
		bind:value={data.tree_size}
	/>
{/snippet}

<div class="container">
	<PricingForm {row_types}>
		{#snippet row(field_name: keyof typeof row_types)}
			{@render {
				number_of_trees,
				tree_size,
			}[field_name]()}
		{/snippet}
	</PricingForm>

	<EstimatedPriceDisplay price={calculated_price} />
</div>

<style>
	.container {
		max-width: 800px;
	}

	:global(:root) {
		font-family: inherit;
		color: inherit;
	}
</style>
