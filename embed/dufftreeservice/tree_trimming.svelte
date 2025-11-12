<svelte:options customElement="tree-trimming" />

<script lang="ts">
	import { pricing, validator, type PricingArguments } from './tree_trimming.ts'
	import { get, set } from '#lib/localstorage.ts'
	import BooleanToggle from '#lib/boolean_toggle.svelte'
	import RadioGroup from '#lib/radio_group.svelte'
	import PricingForm from '#lib/pricing_form.svelte'
	import EstimatedPriceDisplay from '#lib/estimated_price_display.svelte'

	const default_data: PricingArguments = {
		tree_diameter: '11-15 inches',
		pruned_by_arborist_recently: false,
		raise_canopy: false,
		tree_variety: 'other',
		trim_type: 'normal',
	}

	let data = $state(get('tree_trimming_data', validator, default_data))

	const calculated_price = $derived(pricing(data))

	$effect(() => set('tree_trimming_data', data))

	const row_types = {
		tree_diameter: 'radio',
		pruned_by_arborist_recently: 'toggle',
		raise_canopy: 'toggle',
		tree_variety: 'radio',
		trim_type: 'radio',
	} as const
</script>

{#snippet tree_diameter()}
	<div class="left">What is the diameter of the trunk?</div>
	<RadioGroup
		options={[
			{ label: '6-10 inches', value: '6-10 inches' as const },
			{ label: '11-15 inches', value: '11-15 inches' as const },
			{ label: '16-20 inches', value: '16-20 inches' as const },
			{ label: '21-25 inches', value: '21-25 inches' as const },
			{ label: '26-32 inches', value: '26-32 inches' as const },
			{ label: '33-40 inches', value: '33-40 inches' as const },
		]}
		bind:value={data.tree_diameter}
	/>
{/snippet}

{#snippet pruned_by_arborist_recently()}
	<label class="left" for="pruned_by_arborist_recently">Has it been pruned by an arborist in the last 3 years?</label>
	<BooleanToggle bind:checked={data.pruned_by_arborist_recently} id="pruned_by_arborist_recently" />
{/snippet}

{#snippet raise_canopy()}
	<label class="left" for="raise_canopy">Do you want the canopy raised?</label>
	<BooleanToggle bind:checked={data.raise_canopy} id="raise_canopy" />
{/snippet}

{#snippet tree_variety()}
	<div class="left">What variety is it?</div>
	<RadioGroup
		options={[
			{ label: 'Other', value: 'other' as const },
			{ label: 'Oak', value: 'oak' as const },
			{ label: 'Sycamore', value: 'sycamore' as const },
			{ label: 'Locust', value: 'locust' as const },
		]}
		bind:value={data.tree_variety}
	/>
{/snippet}

{#snippet trim_type()}
	<div class="left">Type of trim</div>
	<RadioGroup
		options={[
			{ label: 'Just the necessities (3-6 offending branches)', value: 'just the necessities' as const },
			{ label: 'Normal (2" branches and up)', value: 'normal' as const },
			{ label: 'Premium (1" branches and up)', value: 'premium' as const },
		]}
		bind:value={data.trim_type}
	/>
{/snippet}

<div class="container">
	<PricingForm {row_types}>
		{#snippet row(field_name: keyof typeof row_types)}
			{@render {
				tree_diameter,
				pruned_by_arborist_recently,
				raise_canopy,
				tree_variety,
				trim_type,
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
