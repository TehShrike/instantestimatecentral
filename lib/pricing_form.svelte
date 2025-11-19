<script lang="ts" generics="T extends Record<string, 'toggle' | 'radio' | 'number' | 'button_radio'>">
	import type { Snippet } from 'svelte'

	let {
		row_types,
		row,
	}: {
		row_types: T
		row: Snippet<[keyof T & string]>
	} = $props()
</script>

<form class="pricing-form">
	{#each Object.entries(row_types) as [field_name, type]}
		<div class="form-row" data-type={type}>
			{@render row(field_name)}
		</div>
	{/each}
</form>

<style>
	.pricing-form {
		--vertical_gap: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: var(--vertical_gap);
		font-size: 1rem;

		@media (max-width: 600px) {
			font-size: 0.9rem;
			--vertical_gap: 1rem;
		}
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		align-items: start;

		&[data-type="button_radio"] {
			grid-template-columns: 1fr;
		}

		:global(.left) {
			font-weight: 500;
			color: inherit;
			padding-top: 0.25rem;
		}

		:global(label[for]) {
			cursor: pointer;
		}

		@media (max-width: 650px) {
			gap: 0.75rem;
			grid-template-columns: 1fr 200px;
		}

		@media (max-width: 500px) {
			&[data-type="radio"] {
				grid-template-columns: 1fr;
				justify-items: center;

				:global(.left) {
					justify-self: start;
				}
			}

			&[data-type="toggle"],
			&[data-type="number"] {
				grid-template-columns: 1fr 100px;
			}

		}
	}
</style>
