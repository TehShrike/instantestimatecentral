<svelte:options customElement="tree-trimming" />

<script lang="ts">
	import { pricing, type PricingArguments } from './tree_trimming.ts'
	import { get, set } from '#lib/localstorage.ts'
	import { exact, is_boolean, one_of, type Validator } from '#lib/json_validator.ts'

	const hog_big_around_is_it_validator: Validator<PricingArguments['how_big_around_is_it']> = one_of(
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

	let is_it_broken = $state(get('is_it_broken', is_boolean, false))
	let how_big_around_is_it = $state<PricingArguments['how_big_around_is_it']>(get('how_big_around_is_it', hog_big_around_is_it_validator, '3-5 inches'))
	let distance_from_ground = $state<PricingArguments['distance_from_ground']>(get('distance_from_ground', distance_from_ground_validator, 'under 15 feet'))
	let okay_if_it_falls = $state(get('okay_if_it_falls', is_boolean, true))
	let easy_to_haul_out = $state(get('easy_to_haul_out', is_boolean, true))

	const calculated_price = $derived(() => {
		return pricing({
			is_it_broken,
			how_big_around_is_it,
			distance_from_ground,
			okay_if_it_falls,
			easy_to_haul_out,
		})
	})

	$effect(() => set('is_it_broken', is_it_broken))
	$effect(() => set('how_big_around_is_it', how_big_around_is_it))
	$effect(() => set('distance_from_ground', distance_from_ground))
	$effect(() => set('okay_if_it_falls', okay_if_it_falls))
	$effect(() => set('easy_to_haul_out', easy_to_haul_out))
</script>

<div class="container">
	<form class="pricing-form">
		<div class="form-row">
			<label class="left" for="is_it_broken">Is the limb broken?</label>
			<input type="checkbox" id="is_it_broken" bind:checked={is_it_broken} />
		</div>

		<div class="form-row-radio">
			<div class="left">How big around is it?</div>
			<div class="radio-group">
				<label class="radio-label">
					<input type="radio" bind:group={how_big_around_is_it} value="1-3 inches" />
					1-3 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={how_big_around_is_it} value="3-5 inches" />
					3-5 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={how_big_around_is_it} value="6-9 inches" />
					6-9 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={how_big_around_is_it} value="10-13 inches" />
					10-13 inches
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={how_big_around_is_it} value="14+ inches" />
					14+ inches
				</label>
			</div>
		</div>

		<div class="form-row-radio">
			<div class="left">How far off the ground is it where it meets the trunk?</div>
			<div class="radio-group">
				<label class="radio-label">
					<input type="radio" bind:group={distance_from_ground} value="under 15 feet" />
					under 15 feet
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={distance_from_ground} value="15-20 feet" />
					15-20 feet
				</label>
				<label class="radio-label">
					<input type="radio" bind:group={distance_from_ground} value="higher than 20 feet" />
					higher than 20 feet
				</label>
			</div>
		</div>

		<div class="form-row">
			<label class="left" for="okay_if_it_falls">Is it over anything that couldn't handle a branch hitting it?</label>
			<input type="checkbox" id="okay_if_it_falls" bind:checked={okay_if_it_falls} />
		</div>

		<div class="form-row">
			<label class="left" for="easy_to_haul_out">Is it next to a street or an alley?</label>
			<input type="checkbox" id="easy_to_haul_out" bind:checked={easy_to_haul_out} />
		</div>
	</form>

	<div class="price-display">
		<div class="price-label">Estimated Price:</div>
		<div class="price-value">${calculated_price().toString(2)}</div>
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

	input[type="checkbox"] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
		margin-top: 0.25rem;
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-weight: 400;
		color: inherit;
	}

	label[for], input[type="radio"] {
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

		.radio-group {
			max-width: max-content;
			min-width: min(100%, 220px);
		}

		.form-row {
			grid-template-columns: 1fr 60px;
		}
	}
</style>
