<script lang="ts">
	import type { Snippet } from 'svelte'

	let { children, gap = '1rem' }: { children: Snippet; gap?: string } = $props()
</script>

<div class="vertical-row-with-gap" style="--gap: {gap}">
	{@render children()}
</div>

<style>
	.vertical-row-with-gap {
		display: flex;
		flex-direction: column;
		gap: var(--gap);

		@media (max-width: 600px) {
			gap: calc(var(--gap) / 2);
		}
	}
</style>
