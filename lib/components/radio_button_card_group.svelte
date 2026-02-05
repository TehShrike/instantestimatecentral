<script lang="ts" generics="T extends string">
	import type { FinancialNumber } from 'financial-number'

	type Option = {
		label: string
		value: T
		description?: string
		price_difference?: FinancialNumber
	}

	let { options, value = $bindable() }: { options: Option[]; value?: T } = $props()
</script>

<div class="radio-button-container">
	<div class="radio-button-group">
		{#each options as option}
			<label class="radio-button-option" data-selected={value === option.value}>
				<input type="radio" bind:group={value} value={option.value} />
				<div class="option-content">
					<span class="label-text">{option.label}</span>
					{#if option.description}
						<span class="description-text">{option.description}</span>
					{/if}
				</div>
				{#if value !== option.value && option.price_difference}
					<span class="price-diff">
						{option.price_difference.gt('0') ? '+' : ''}{option.price_difference.toString(0)}$
					</span>
				{/if}
			</label>
		{/each}
	</div>
</div>

<style>
	.radio-button-container {
		container-type: inline-size;
		max-width: 100%;
		overflow: hidden;
	}

	.radio-button-group {
		display: grid;
		grid-template-columns: repeat(2, minmax(max-content, 1fr));
		gap: 0.5rem;
		--brand_color: var(--iec_brand_color, #6b8e23);
		--button_border_radius: var(--iec_button_border_radius, var(--default_border_radius));

		@container (max-width: 300px) {
			grid-template-columns: minmax(max-content, 1fr);
		}

		@container (min-width: 500px) {
			grid-template-columns: repeat(3, minmax(max-content, 1fr));
		}
	}

	.radio-button-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 2px solid var(--brand_color);
		border-radius: var(--button_border_radius);
		background-color: white;
		cursor: pointer;
		font-weight: 400;
		color: inherit;
		transition: background-color 0.15s ease;

		&[data-selected='true'] {
			background-color: color-mix(in srgb, var(--brand_color) 15%, white);
		}

		&:hover:not([data-selected='true']) {
			background-color: color-mix(in srgb, var(--brand_color) 8%, white);
		}

		&:focus-within {
			outline: 2px solid var(--brand_color);
			outline-offset: 2px;
		}
	}

	input[type='radio'] {
		cursor: pointer;
		accent-color: var(--brand_color);
		width: 1rem;
		height: 1rem;
		margin: 0;
	}

	.option-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label-text {
		white-space: nowrap;
	}

	.description-text {
		font-size: 0.875em;
		color: #7f8c8d;
		line-height: 1.4;
	}

	.price-diff {
		font-size: 0.875em;
		font-weight: 600;
		white-space: nowrap;
		margin-left: auto;
	}
</style>
