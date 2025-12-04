<script lang="ts">
	import type { Snippet } from 'svelte'

	let { children }: { children: Snippet } = $props()
</script>

<div class="pricing-wrapper">
	{@render children()}
</div>

<style>
	.pricing-wrapper {
		max-width: 800px;
		box-sizing: border-box;

		display: flex;
		flex-direction: column;
		gap: 2rem;

		@media (max-width: 600px) {
			gap: 1rem;
		}
	}

	:global(:root) {
		font-family: inherit;
		color: inherit;
	}
</style>
