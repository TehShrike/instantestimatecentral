<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		disabled = false,
		type = 'button' as const,
		onclick,
		children,
	}: {
		disabled?: boolean
		type?: 'button' | 'submit' | 'reset'
		onclick?: (event: MouseEvent) => void
		children: Snippet
	} = $props()
</script>

<button {type} {disabled} {onclick}>
	{@render children()}
</button>

<style>
	button {
		--button_brand_color: var(--iec_brand_color, #0074ff);
		--button_border_radius: var(--iec_button_border_radius, var(--default_border_radius));

		padding: 0.75rem 1.5rem;
		background-color: var(--button_brand_color);
		color: white;
		border: none;
		border-radius: var(--button_border_radius);
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 100ms,
			filter 100ms;

		&:hover {
			filter: brightness(0.9);
		}

		&:active {
			filter: brightness(0.8);
		}

		&:disabled {
			background-color: #95a5a6;
			cursor: not-allowed;
			filter: none;
		}

		@media (max-width: 900px) {
			font-size: 0.9em;
		}

		@media (max-width: 500px) {
			font-size: 0.85em;
			padding: 0.6rem 1rem;
		}
	}
</style>
