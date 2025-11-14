<script lang="ts">
	import type { Snippet } from 'svelte'

	type Tab = {
		name: string
		content: Snippet
	}

	let { tabs, current_tab = $bindable(tabs[0]?.name) }: { tabs: Tab[]; current_tab?: string } = $props()

	const selected_tab_index = $derived(tabs.findIndex(tab => tab.name === current_tab))

	const selected_tab = $derived(tabs[selected_tab_index])
</script>

<div class="tabs-container">
	<div class="tabs-header">
		{#each tabs as tab, index}
			<button
				class="tab-button"
				data-selected={selected_tab_index === index}
				onclick={() => current_tab = tab.name}
			>
				{tab.name}
			</button>
		{/each}
	</div>

	<div class="tabs-content">
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
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tab-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px 8px 0 0;
		font-size: 1rem;
		font-weight: 600;
		font-family: inherit;
		color: #2c3e50;
		background: #ecf0f1;
		border: 2px solid transparent;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.tab-button:hover {
		background: #dfe6e9;
	}

	.tab-button[data-selected="true"] {
		background: white;
		color: #2c3e50;
		border: 2px solid black;
		border-bottom: none;
	}

	.tabs-content {
		padding: 1rem 0;
	}
</style>
