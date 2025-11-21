<script lang="ts" module>
	export type Tab<Identifier extends any> = {
		name: string
		content: Snippet
		identifier: Identifier
	}
</script>

<script lang="ts" generics="Identifier extends any">
	import type { Snippet } from 'svelte'

	let {
		tabs,
		current_tab_identifier = $bindable(tabs[0]?.identifier),
	}: {
		tabs: Tab<Identifier>[]
		current_tab_identifier?: Identifier
	} = $props()

	const selected_tab_index = $derived(tabs.findIndex(tab => tab.identifier === current_tab_identifier))

	const selected_tab = $derived(tabs[selected_tab_index])

	let container_width = $state(0)
	let pixels_per_tab = $derived(container_width / tabs.length)
	let need_to_wrap = $derived(pixels_per_tab <= 100)
</script>

<div class="tabs-container" bind:clientWidth={container_width}>
	<div class="tabs-header" data-need-to-wrap={need_to_wrap}>
		{#each tabs as tab, index}
			<button
				class="tab-button"
				data-selected={selected_tab_index === index}
				onclick={() => current_tab_identifier = tab.identifier}
			>
				{tab.name}
			</button>
		{/each}
	</div>

	<div>
		{#if selected_tab}
			{@render selected_tab.content()}
		{/if}
	</div>
</div>

<style>
	.tabs-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.tabs-header {
		display: flex;
		gap: 0.25rem;
		width: 100%;

		&[data-need-to-wrap="true"] {
			flex-wrap: wrap;
		}
	}

	.tab-button {
		flex: 1;
		padding: 0.75rem 0.25rem;
		border-radius: 8px 8px 0 0;
		font-size: 1em;
		font-weight: 600;
		font-family: inherit;
		color: #2c3e50;
		background: #ecf0f1;
		border: 2px solid transparent;
		border-bottom: none;
		cursor: pointer;
		transition: background-color 0.2s;
		text-align: center;
		flex-basis: 40%;

		&:hover {
			background: #dfe6e9;
		}

		&[data-selected="true"] {
			background: white;
			color: #2c3e50;
			border: 2px solid black;
			border-bottom: none;
		}

		@media (max-width: 600px) {
			font-size: 0.85em;
			padding: 0.6rem 0.25rem;
		}
	}
</style>
