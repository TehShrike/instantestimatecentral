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
</script>

<div class="tabs-container">
	<div class="tabs-header">
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
	}

	.tabs-header {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1rem;
		width: 100%;
	}

	.tab-button {
		flex: 1;
		padding: 0.75rem 0.25rem;
		border: none;
		border-radius: 8px 8px 0 0;
		font-size: 1em;
		font-weight: 600;
		font-family: inherit;
		color: #2c3e50;
		background: #ecf0f1;
		border: 2px solid transparent;
		cursor: pointer;
		transition: background-color 0.2s;
		text-align: center;

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
