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
		padding: 0 1rem;

		@media (max-width: 500px) {
			padding: 0 0.5rem;
		}
	}

	:global(:root) {
		font-family: inherit;
		color: inherit;
	}
</style>
