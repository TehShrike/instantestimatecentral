<script lang="ts" generics="T extends string">
	import type { FinancialNumber } from 'financial-number'

	type Option = { label: string; description: string; value: T; price_difference?: FinancialNumber }

	let { options, value = $bindable() }: { options: Option[]; value?: T } = $props()
</script>

<div class="button-radio-group">
	{#each options as option}
		<button
			type="button"
			role="radio"
			class="radio-button"
			data-active={value === option.value}
			aria-checked={value === option.value}
			onclick={() => value = option.value}
		>
			<div class="button-content">
				<strong>
					{option.label}
				</strong>
				<small>{option.description}</small>
			</div>
			<span class="price-diff" class:visible={value !== option.value && option.price_difference}>
				{#if value !== option.value && option.price_difference}
					{option.price_difference.gt('0') ? '+' : ''}{option.price_difference.toString(0)}$
				{/if}
			</span>
		</button>
	{/each}
</div>

<style>
	.button-radio-group {
		display: flex;
		flex-direction: row;
		gap: 0.75rem;
	}

	.button-radio-group > * {
		flex-basis: 0;
		flex-grow: 1;
	}

	.radio-button {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: stretch;
		padding: 1rem;
		border: 2px solid #2c3e50;
		border-radius: 8px;
		background-color: white;
		cursor: pointer;
		font-family: inherit;
		text-align: left;
	}

	.button-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-button:focus {
		outline: 2px solid #0074ff;
		outline-offset: 2px;
	}

	.radio-button[data-active="true"] {
		background-color: #0074ff;
		border-color: #0074ff;
	}

	.radio-button[data-active="true"] strong,
	.radio-button[data-active="true"] small {
		color: white;
	}

	.radio-button strong {
		font-weight: 600;
		font-size: 1rem;
		color: #2c3e50;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.radio-button small {
		font-size: 0.875rem;
		color: #7f8c8d;
		line-height: 1.4;
	}

	.price-diff {
		font-size: 0.875rem;
		font-weight: 600;
		white-space: nowrap;
		text-align: right;
		min-height: 1.25rem;
		margin-top: 0.5rem;
		opacity: 0;
		visibility: hidden;
	}

	.price-diff.visible {
		opacity: 1;
		visibility: visible;
	}

	@media (max-width: 600px) {
		.button-radio-group {
			flex-direction: column;
		}
	}
</style>
