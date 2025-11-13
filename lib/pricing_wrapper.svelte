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
	}

	:global(:root) {
		font-family: inherit;
		color: inherit;
	}
</style>
