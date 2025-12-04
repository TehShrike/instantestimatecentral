<script lang="ts">
	import type { TreeTrimmingPricingArguments } from '#pricing/dufftreeservice/tree_trimming.ts'
	import type { FinancialNumber } from 'financial-number'
	import { set } from '#lib/localstorage.ts'
	import BooleanToggle from '#lib/boolean_toggle.svelte'
	import RadioGroup from '#lib/radio_group.svelte'
	import ButtonRadioGroup from '#lib/button_radio_group.svelte'
	import PricingForm from '#lib/pricing_form.svelte'
	import EstimatedPriceDisplay from '#lib/estimated_price_display.svelte'

	let {
		pricing,
		pricing_args = $bindable(),
	}: {
		pricing: (args: TreeTrimmingPricingArguments) => FinancialNumber
		pricing_args: TreeTrimmingPricingArguments
	} = $props()

	const calculated_price = $derived(pricing(pricing_args))

	const trim_type_options = $derived([
		{
			label: 'Just the necessities',
			description: 'a half dozen or fewer offending branches',
			value: 'just the necessities' as const,
			price_difference: pricing({ ...pricing_args, trim_type: 'just the necessities' }).minus(calculated_price),
		},
		{
			label: 'Normal',
			description: '2" branches and larger',
			value: 'normal' as const,
			price_difference: pricing({ ...pricing_args, trim_type: 'normal' }).minus(calculated_price),
		},
		{
			label: 'Premium',
			description: '1" branches and larger',
			value: 'premium' as const,
			price_difference: pricing({ ...pricing_args, trim_type: 'premium' }).minus(calculated_price),
		},
	])

	$effect(() => set('tree_trimming_data', pricing_args))

	const row_types = {
		tree_diameter: 'radio',
		pruned_by_arborist_recently: 'toggle',
		raise_canopy: 'toggle',
		tree_variety: 'radio',
		trim_type: 'button_radio',
	} as const
</script>

{#snippet tree_diameter()}
	<div class="left">What is the diameter of the trunk at chest height?</div>
	<RadioGroup
		options={[
			{ label: '6-10 inches', value: '6-10 inches' as const },
			{ label: '11-15 inches', value: '11-15 inches' as const },
			{ label: '16-20 inches', value: '16-20 inches' as const },
			{ label: '21-25 inches', value: '21-25 inches' as const },
			{ label: '26-32 inches', value: '26-32 inches' as const },
			{ label: '33-40 inches', value: '33-40 inches' as const },
		]}
		bind:value={pricing_args.tree_diameter}
	/>
{/snippet}

{#snippet pruned_by_arborist_recently()}
	<label class="left" for="pruned_by_arborist_recently">Has it been pruned by an arborist in the last 3 years?</label>
	<BooleanToggle bind:checked={pricing_args.pruned_by_arborist_recently} id="pruned_by_arborist_recently" />
{/snippet}

{#snippet raise_canopy()}
	<label class="left" for="raise_canopy">Do you want the canopy raised?</label>
	<BooleanToggle bind:checked={pricing_args.raise_canopy} id="raise_canopy" />
{/snippet}

{#snippet tree_variety()}
	<div class="left">What variety is it?</div>
	<RadioGroup
		options={[
			{ label: 'Other', value: 'other' as const },
			{ label: 'Sycamore', value: 'sycamore' as const },
			{ label: 'Oak', value: 'oak' as const },
			{ label: 'Locust', value: 'locust' as const },
		]}
		bind:value={pricing_args.tree_variety}
	/>
{/snippet}

{#snippet trim_type()}
	<ButtonRadioGroup options={trim_type_options} bind:value={pricing_args.trim_type} />
{/snippet}

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
