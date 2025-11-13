<script lang="ts">
	import { pricing, validator, type PricingArguments } from '#pricing/dufftreeservice/tree_removal.ts'
	import { get, set } from '#lib/localstorage.ts'
	import BooleanToggle from '#lib/boolean_toggle.svelte'
	import RadioGroup from '#lib/radio_group.svelte'
	import PricingForm from '#lib/pricing_form.svelte'
	import EstimatedPriceDisplay from '#lib/estimated_price_display.svelte'
	import ContactForm from '#lib/contact_form.svelte'

	const default_data: PricingArguments = {
		tree_diameter: '11-15 inches',
		branches_over_something: 'nothing underneath',
		fence: 'no',
		adjacent_to_street_or_alley: true,
	}

	let data = $state(get('tree_removal_data', validator, default_data))

	const calculated_price = $derived(pricing(data))

	$effect(() => set('tree_removal_data', data))

	const row_types = {
		tree_diameter: 'radio',
		branches_over_something: 'radio',
		fence: 'radio',
		adjacent_to_street_or_alley: 'toggle',
	} as const

	const handle_contact_submit = (contact_data: { name: string; email: string; phone: string; street_address: string }) => {
		console.log('Contact form submitted:', contact_data, 'Pricing data:', data, 'Price:', calculated_price.toString(2))
	}
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
		bind:value={data.tree_diameter}
	/>
{/snippet}

{#snippet branches_over_something()}
	<div class="left">Are its branches over anything that you don't want a branch to land on?</div>
	<RadioGroup
		options={[
			{ label: 'Nope', value: 'nothing underneath' as const },
			{ label: 'Some branches', value: 'some branches over something' as const },
			{ label: 'All big branches', value: 'all big branches are over something' as const },
		]}
		bind:value={data.branches_over_something}
	/>
{/snippet}

{#snippet fence()}
	<div class="left">Is the tree inside a fence?</div>
	<RadioGroup
		options={[
			{ label: 'No', value: 'no' as const },
			{ label: 'Yes – single gate', value: 'single gate' as const },
			{ label: 'Yes – double gate', value: 'double gate' as const },
		]}
		bind:value={data.fence}
	/>
{/snippet}

{#snippet adjacent_to_street_or_alley()}
	<label class="left" for="adjacent_to_street_or_alley">Is the tree adjacent to a street or alley?</label>
	<BooleanToggle bind:checked={data.adjacent_to_street_or_alley} id="adjacent_to_street_or_alley" />
{/snippet}

<PricingForm {row_types}>
	{#snippet row(field_name: keyof typeof row_types)}
		{@render {
			tree_diameter,
			branches_over_something,
			fence,
			adjacent_to_street_or_alley,
		}[field_name]()}
	{/snippet}
</PricingForm>

<EstimatedPriceDisplay price={calculated_price} />

<ContactForm onsubmit={handle_contact_submit} />
