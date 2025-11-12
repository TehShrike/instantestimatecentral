<svelte:options customElement="limb-removal" />

<script lang="ts">
	import { pricing, type PricingArguments } from './limb_removal.ts'
	import { get, set } from '#lib/localstorage.ts'
	import { exact, is_boolean, object, one_of, type Validator } from '#lib/json_validator.ts'
	import BooleanToggle from '#lib/boolean_toggle.svelte'
	import RadioGroup from '#lib/radio_group.svelte'

	const how_big_around_is_it_validator: Validator<PricingArguments['how_big_around_is_it']> = one_of(
		exact('1-3 inches' as const),
		exact('3-5 inches' as const),
		exact('6-9 inches' as const),
		exact('10-13 inches' as const),
		exact('14+ inches' as const),
	)

	const distance_from_ground_validator: Validator<PricingArguments['distance_from_ground']> = one_of(
		exact('under 15 feet' as const),
		exact('15-20 feet' as const),
		exact('higher than 20 feet' as const),
	)

	const tree_trimming_data_validator: Validator<PricingArguments> = object({
		is_it_broken: is_boolean,
		how_big_around_is_it: how_big_around_is_it_validator,
		distance_from_ground: distance_from_ground_validator,
		okay_if_it_falls: is_boolean,
		easy_to_haul_out: is_boolean,
	})

	const default_data: PricingArguments = {
		is_it_broken: false,
		how_big_around_is_it: '3-5 inches',
		distance_from_ground: 'under 15 feet',
		okay_if_it_falls: true,
		easy_to_haul_out: true,
	}

	let data = $state(get('tree_trimming_data', tree_trimming_data_validator, default_data))

	const calculated_price = $derived(pricing(data))

	$effect(() => set('tree_trimming_data', data))
</script>

<div class="container">
	<form class="pricing-form">
		<div class="form-row">
			<label class="left" for="is_it_broken">Is the limb broken?</label>
			<BooleanToggle bind:checked={data.is_it_broken} id="is_it_broken" />
		</div>

		<div class="form-row-radio">
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
		</div>

		<div class="form-row-radio">
			<div class="left">How far off the ground is it where it meets the trunk?</div>
			<RadioGroup
				options={[
					{ label: 'under 15 feet', value: 'under 15 feet' as const },
					{ label: '15-20 feet', value: '15-20 feet' as const },
					{ label: 'higher than 20 feet', value: 'higher than 20 feet' as const },
				]}
				bind:value={data.distance_from_ground}
			/>
		</div>

		<div class="form-row">
			<label class="left" for="okay_if_it_falls">Is it over anything that can't handle a branch hitting it?</label>
			<BooleanToggle bind:checked={data.okay_if_it_falls} id="okay_if_it_falls" />
		</div>

		<div class="form-row">
			<label class="left" for="easy_to_haul_out">Is it next to a street or an alley?</label>
			<BooleanToggle bind:checked={data.easy_to_haul_out} id="easy_to_haul_out" />
		</div>
	</form>

	<div class="price-display">
		<div class="price-label">Estimated Price:</div>
		<div class="price-value">${calculated_price.toString(0)}</div>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
	}

	:global(:root) {
		font-family: inherit;
		color: inherit;
	}

	.pricing-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.form-row, .form-row-radio {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		align-items: start;
	}

	.left {
		font-weight: 500;
		color: inherit;
		padding-top: 0.25rem;
	}

	label[for] {
		cursor: pointer;
	}

	.price-display {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #ecf0f1;
		border-radius: 8px;
		margin-top: 2rem;
	}

	.price-label {
		font-weight: 600;
		color: #2c3e50;
		font-size: 1.25rem;
	}

	.price-value {
		text-align: right;
		font-weight: 700;
		color: #27ae60;
		font-size: 1.5rem;
	}

	@media (max-width: 600px) {
		.form-row-radio {
			grid-template-columns: 1fr;
			justify-items: center;
		}

		.form-row-radio .left {
			justify-self: start;
		}

		.form-row {
			grid-template-columns: 1fr 70px;
		}
	}
</style>
