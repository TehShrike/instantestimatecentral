<script lang="ts">
	let { checked = $bindable(false), id }: { checked?: boolean; id?: string } = $props()
</script>

<input
	type="checkbox"
	class="toggle-input"
	bind:checked
	{id}
/>
<label for={id} class="toggle-display" data-checked={checked}>
	{#if checked}
		<span class="toggle-text-yes">Yes</span>
	{/if}
	<div class="toggle-circle"></div>
	{#if !checked}
		<span class="toggle-text-no">No</span>
	{/if}
</label>

<style>
	.toggle-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.toggle-display {
		--width: 70px;
		--height: 36px;
		--toggle_height_and_width: calc(var(--height) - 8px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: var(--width);
		height: var(--height);
		background-color: #d3d3d3;
		border-radius: calc(var(--height) / 2);
		padding: 0 4px;
		cursor: pointer;

		@media (max-width: 600px) {
			--width: 55px;
			--height: 28px;
		}
	}

	.toggle-display[data-checked="true"] {
		background-color: #0074ff;
	}

	.toggle-text-yes,
	.toggle-text-no {
		font-size: 1rem;
		font-weight: 600;
		user-select: none;
		padding: 0 6px;
		max-width: calc(var(--width) - var(--toggle_height_and_width) - 12px);

		@media (max-width: 600px) {
			font-size: 0.75rem;
		}
	}

	.toggle-text-yes {
		color: white;
	}

	.toggle-text-no {
		color: black;
	}

	.toggle-circle {
		width: var(--toggle_height_and_width);
		height: var(--toggle_height_and_width);
		background-color: white;
		border-radius: 50%;
	}

	.toggle-input:focus-visible + .toggle-display {
		outline: 2px solid black;
		outline-offset: 2px;
	}
</style>
