<svelte:options customElement="tree-trimming" />

<script lang="ts">
	import { pricing, type PricingArguments } from './tree_trimming.ts'
	import { get, set } from '#lib/localstorage.ts'
<<<<<<< HEAD:embed/src/dufftreeservice/tree_trimming.svelte
	import { exact, is_boolean, one_of, type Validator } from '#lib/json_validator.ts'
	import BooleanToggle from '#lib/boolean_toggle.svelte'
	import RadioGroup from '#lib/radio_group.svelte'
=======
	import { exact, is_boolean, object, one_of, type Validator } from '#lib/json_validator.ts'
>>>>>>> upstream/main:embed/dufftreeservice/tree_trimming.svelte

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

<<<<<<< HEAD:embed/src/dufftreeservice/tree_trimming.svelte
	let is_it_broken = $state(get('is_it_broken', is_boolean, false))
	let how_big_around_is_it = $state<PricingArguments['how_big_around_is_it']>(get('how_big_around_is_it', hog_big_around_is_it_validator, '3-5 inches'))
	let distance_from_ground = $state<PricingArguments['distance_from_ground']>(get('distance_from_ground', distance_from_ground_validator, 'under 15 feet'))
	let okay_if_it_falls = $state(get('okay_if_it_falls', is_boolean, true))
	let easy_to_haul_out = $state(get('easy_to_haul_out', is_boolean, true))

	const calculated_price = $derived(pricing({
		is_it_broken,
		how_big_around_is_it,
		distance_from_ground,
		okay_if_it_falls,
		easy_to_haul_out,
	}))
=======
	const tree_trimming_data_validator: Validator<PricingArguments> = object({
		is_it_broken: is_boolean,
		how_big_around_is_it: how_big_around_is_it_validator,
		distance_from_ground: distance_from_ground_validator,
		okay_if_it_falls: is_boolean,
		easy_to_haul_out: is_boolean,
	})
>>>>>>> upstream/main:embed/dufftreeservice/tree_trimming.svelte

	const default_data: PricingArguments = {
		is_it_broken: false,
		how_big_around_is_it: '3-5 inches',
		distance_from_ground: 'under 15 feet',
		okay_if_it_falls: true,
		easy_to_haul_out: true,
	}

	let data = $state(get('tree_trimming_data', tree_trimming_data_validator, default_data))

	const calculated_price = $derived(() => {
		return pricing(data)
	})

	$effect(() => set('tree_trimming_data', data))
</script>

<div class="container">
	<form class="pricing-form">
		<div class="form-row">
			<label class="left" for="is_it_broken">Is the limb broken?</label>
<<<<<<< HEAD:embed/src/dufftreeservice/tree_trimming.svelte
			<BooleanToggle bind:checked={is_it_broken} id="is_it_broken" />
=======
			<input type="checkbox" id="is_it_broken" bind:checked={data.is_it_broken} />
>>>>>>> upstream/main:embed/dufftreeservice/tree_trimming.svelte
		</div>

		<div class="form-row-radio">
			<div class="left">How big around is it?</div>
<<<<<<< HEAD:embed/src/dufftreeservice/tree_trimming.svelte
			<RadioGroup
				options={[
					{ label: '1-3 inches', value: '1-3 inches' as const },
					{ label: '3-5 inches', value: '3-5 inches' as const },
					{ label: '6-9 inches', value: '6-9 inches' as const },
					{ label: '10-13 inches', value: '10-13 inches' as const },
					{ label: '14+ inches', value: '14+ inches' as const },
				]}
				bind:value={how_big_around_is_it}
			/>
=======
			<div class="radio-group">
				<label class="radio-label">
					<input type="radio" bind:group={data.how_big_around_is_it} value="1-3 inches" />
					1-3 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={data.how_big_around_is_it} value="3-5 inches" />
					3-5 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={data.how_big_around_is_it} value="6-9 inches" />
					6-9 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={data.how_big_around_is_it} value="10-13 inches" />
					10-13 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={data.how_big_around_is_it} value="14+ inches" />
					14+ inches
				</label>
			</div>
>>>>>>> upstream/main:embed/dufftreeservice/tree_trimming.svelte
		</div>

		<div class="form-row-radio">
			<div class="left">How far off the ground is it where it meets the trunk?</div>
<<<<<<< HEAD:embed/src/dufftreeservice/tree_trimming.svelte
			<RadioGroup
				options={[
					{ label: 'under 15 feet', value: 'under 15 feet' as const },
					{ label: '15-20 feet', value: '15-20 feet' as const },
					{ label: 'higher than 20 feet', value: 'higher than 20 feet' as const },
				]}
				bind:value={distance_from_ground}
			/>
		</div>

		<div class="form-row">
			<label class="left" for="okay_if_it_falls">Is it over anything that can't handle a branch hitting it?</label>
			<BooleanToggle bind:checked={okay_if_it_falls} id="okay_if_it_falls" />
=======
			<div class="radio-group">
				<label class="radio-label">
					<input type="radio" bind:group={data.distance_from_ground} value="under 15 feet" />
					under 15 feet
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={data.distance_from_ground} value="15-20 feet" />
					15-20 feet
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={data.distance_from_ground} value="higher than 20 feet" />
					higher than 20 feet
				</label>
			</div>
		</div>

		<div class="form-row">
			<label class="left" for="okay_if_it_falls">Is it over anything that couldn't handle a branch hitting it?</label>
			<input type="checkbox" id="okay_if_it_falls" bind:checked={data.okay_if_it_falls} />
>>>>>>> upstream/main:embed/dufftreeservice/tree_trimming.svelte
		</div>

		<div class="form-row">
			<label class="left" for="easy_to_haul_out">Is it next to a street or an alley?</label>
<<<<<<< HEAD:embed/src/dufftreeservice/tree_trimming.svelte
			<BooleanToggle bind:checked={easy_to_haul_out} id="easy_to_haul_out" />
=======
			<input type="checkbox" id="easy_to_haul_out" bind:checked={data.easy_to_haul_out} />
>>>>>>> upstream/main:embed/dufftreeservice/tree_trimming.svelte
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

		.form-row-radio :global(.radio-group) {
			max-width: max-content;
			min-width: min(100%, 220px);
		}

		.form-row {
			grid-template-columns: 1fr 70px;
		}
	}
</style>
