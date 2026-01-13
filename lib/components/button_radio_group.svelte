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
			onclick={() => (value = option.value)}
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
		--button_selected_color: var(--iec_brand_color, #0074ff);
		--button_border_radius: var(--iec_button_border_radius, 16px);

		& > * {
			flex-basis: 0;
			flex-grow: 1;
		}

		@media (max-width: 600px) {
			flex-direction: column;
			gap: 0.3rem;
		}
	}

	.button-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-button {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: stretch;
		padding: 1rem;
		border: 2px solid #2c3e50;
		border-radius: var(--button_border_radius);
		background-color: white;
		cursor: pointer;
		font-family: inherit;
		text-align: left;
		font-size: 1em;

		&:focus {
			outline: 2px solid var(--button_selected_color);
			outline-offset: 2px;
		}

		&[data-active='true'] {
			background-color: var(--button_selected_color);

			strong,
			small {
				color: white;
			}
		}

		strong {
			font-weight: 600;
			font-size: 1em;
			color: #2c3e50;
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
		}

		small {
			font-size: 0.875em;
			color: #7f8c8d;
			line-height: 1.4;
		}

		@media (max-width: 900px) {
			padding: 0.5rem 0.65rem;

			strong {
				font-size: 0.9em;
			}

			small {
				font-size: 0.8em;
			}
		}

		@media (max-width: 600px) {
			padding: 0.5rem;
			gap: 0;

			strong {
				font-size: 0.85em;
			}

			small {
				font-size: 0.75em;
			}
		}
	}

	.price-diff {
		font-size: 0.875em;
		font-weight: 600;
		white-space: nowrap;
		text-align: right;
		min-height: 1.25rem;
		opacity: 0;
		visibility: hidden;

		&.visible {
			opacity: 1;
			visibility: visible;
		}

		@media (max-width: 600px) {
			font-size: 0.75em;
		}
	}
</style>
