<script lang="ts">
	import type { FinancialNumber } from 'financial-number'

	let { price }: { price: FinancialNumber } = $props()
</script>

<div class="price-display">
	<div class="price-label">Estimated Price:</div>
	<div class="price-value">${price.toString(0)}</div>
</div>

<style>
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

	@media (max-width: 900px) {
		.price-display {
			padding: 1rem;
		}

		.price-label {
			font-size: 1.1rem;
		}

		.price-value {
			font-size: 1.3rem;
		}
	}

	@media (max-width: 500px) {
		.price-display {
			padding: 0.75rem;
			gap: 0.5rem;
		}

		.price-label {
			font-size: 1rem;
		}

		.price-value {
			font-size: 1.2rem;
		}
	}
</style>
