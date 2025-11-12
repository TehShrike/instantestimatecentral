<script lang="ts" generics="T extends Record<string, 'toggle' | 'radio'>">
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
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		align-items: start;
	}

	.form-row :global(.left) {
		font-weight: 500;
		color: inherit;
		padding-top: 0.25rem;
	}

	.form-row :global(label[for]) {
		cursor: pointer;
	}

	@media (max-width: 600px) {
		.form-row[data-type="radio"] {
			grid-template-columns: 1fr;
			justify-items: center;
		}

		.form-row[data-type="radio"] :global(.left) {
			justify-self: start;
		}

		.form-row[data-type="toggle"] {
			grid-template-columns: 1fr 70px;
		}
	}
</style>
