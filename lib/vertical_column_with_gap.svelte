<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		vertical_gap = '2rem',
		children
	}: {
		vertical_gap?: string
		children: Snippet
	} = $props()
</script>

<div class=vertical_column_with_gap style="--vertical_gap: {vertical_gap}">
	{@render children()}
</div>

<style>
	.vertical_column_with_gap {
		display: flex;
		flex-direction: column;
		gap: var(--vertical_gap);

		@media (max-width: 600px) {
			gap: calc(var(--vertical_gap) / 2)
		}
	}
</style>
