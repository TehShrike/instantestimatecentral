<script lang="ts">
	import { pricing, validator, type LimbRemovalPricingArguments } from '#pricing/dufftreeservice/limb_removal.ts'
	import { get, set } from '#lib/localstorage.ts'
	import BooleanToggle from '#lib/boolean_toggle.svelte'
	import RadioGroup from '#lib/radio_group.svelte'
	import PricingForm from '#lib/pricing_form.svelte'
	import EstimatedPriceDisplay from '#lib/estimated_price_display.svelte'
	import ContactForm from '#lib/contact_form.svelte'
	import ErrorDisplay from '#lib/error_display.svelte'
	import { post } from './fetch_executor.ts'

	let error = $state<unknown>(null)

	const default_data: LimbRemovalPricingArguments = {
		is_it_broken: false,
		how_big_around_is_it: '3-5 inches',
		distance_from_ground: 'under 15 feet',
		branches_over_something: false,
		easy_to_haul_out: true,
	}

	let data = $state(get('limb_removal_data', validator, default_data))

	const calculated_price = $derived(pricing(data))

	$effect(() => set('limb_removal_data', data))

	const row_types = {
		is_it_broken: 'toggle',
		how_big_around_is_it: 'radio',
		distance_from_ground: 'radio',
		branches_over_something: 'toggle',
		easy_to_haul_out: 'toggle',
	} as const

	const handle_contact_submit = async (contact_data: { name: string; email: string; phone: string; street_address: string; extra: Record<string, string> }) => {
		try {
			await post('/send_estimate_email', {
				service: 'limb_removal',
				args: data,
				contact: contact_data,
			})
			error = null
		} catch (err) {
			error = err
		}
	}
</script>

{#snippet is_it_broken()}
	<label class="left" for="is_it_broken">Is the limb broken?</label>
	<BooleanToggle bind:checked={data.is_it_broken} id="is_it_broken" />
{/snippet}

{#snippet how_big_around_is_it()}
	<div class="left">How big around is it?</div>
	<RadioGroup
		options={[
			{ label: '1-3 inches', value: '1-3 inches' as const },
			{ label: '3-5 inches', value: '3-5 inches' as const },
			{ label: '6-9 inches', value: '6-9 inches' as const },
			{ label: '10-13 inches', value: '10-13 inches' as const },
			{ label: '14+ inches', value: '14+ inches' as const },
		]}
		bind:value={data.how_big_around_is_it}
	/>
{/snippet}

{#snippet distance_from_ground()}
	<div class="left">How far off the ground is it where it meets the trunk?</div>
	<RadioGroup
		options={[
			{ label: 'under 15 feet', value: 'under 15 feet' as const },
			{ label: '15-20 feet', value: '15-20 feet' as const },
			{ label: 'higher than 20 feet', value: 'higher than 20 feet' as const },
		]}
		bind:value={data.distance_from_ground}
	/>
{/snippet}

{#snippet branches_over_something()}
	<label class="left" for="branches_over_something">Is it over anything that can't handle a branch landing on it?</label>
	<BooleanToggle bind:checked={data.branches_over_something} id="branches_over_something" />
{/snippet}

{#snippet easy_to_haul_out()}
	<label class="left" for="easy_to_haul_out">Is it next to a street or an alley?</label>
	<BooleanToggle bind:checked={data.easy_to_haul_out} id="easy_to_haul_out" />
{/snippet}

<PricingForm {row_types}>
	{#snippet row(field_name: keyof typeof row_types)}
		{@render {
			is_it_broken,
			how_big_around_is_it,
			distance_from_ground,
			branches_over_something,
			easy_to_haul_out,
		}[field_name]()}
	{/snippet}
</PricingForm>

<EstimatedPriceDisplay price={calculated_price} />

<ContactForm onsubmit={handle_contact_submit} />

<ErrorDisplay {error} />
