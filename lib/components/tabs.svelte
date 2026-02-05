<script lang="ts" module>
	export type Tab<Identifier extends any> = {
		name: string
		content: Snippet
		identifier: Identifier
	}
</script>

<script lang="ts" generics="Identifier extends any">
	import type { Snippet } from 'svelte'

	// svelte-ignore state_referenced_locally
	let {
		tabs,
		current_tab_identifier = $bindable(tabs[0]?.identifier),
	}: {
		tabs: Tab<Identifier>[]
		current_tab_identifier?: Identifier | null
	} = $props()

	const selected_tab_index = $derived(tabs.findIndex((tab) => tab.identifier === current_tab_identifier))

	const selected_tab = $derived(current_tab_identifier === null ? null : tabs[selected_tab_index])

	let container_width = $state(0)
	let pixels_per_tab = $derived(container_width / tabs.length)
	let need_to_wrap = $derived(pixels_per_tab <= 100)
</script>

<div class="tabs-container" bind:clientWidth={container_width}>
	<div class="tabs-header" data-need-to-wrap={need_to_wrap} data-no-tab-selected={current_tab_identifier === null}>
		{#each tabs as tab, index}
			<button
				class="tab-button"
				data-selected={selected_tab_index === index}
				onclick={() => (current_tab_identifier = tab.identifier)}
			>
				{tab.name}
			</button>
		{/each}
	</div>

	{#if selected_tab}
		<div>
			{@render selected_tab.content()}
		</div>
	{/if}
</div>

<style>
	.tabs-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		--button_outline_color: var(--iec_brand_color, black);
		--button_border_radius: var(--iec_button_border_radius, var(--default_border_radius));
	}

	.tabs-header {
		display: flex;
		gap: 0.25rem;
		width: 100%;

		&[data-need-to-wrap='true'] {
			flex-wrap: wrap;
		}
	}

	.tab-button {
		flex: 1;
		padding: 0.75rem 0.25rem;
		border-radius: var(--button_border_radius) var(--button_border_radius) 0 0;
		font-size: 1em;
		font-weight: 600;
		font-family: inherit;
		color: #2c3e50;
		background: #ecf0f1;
		border: 2px solid transparent;
		border-bottom: none;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;
		text-align: center;
		flex-basis: 40%;

		&:hover {
			background: #dfe6e9;
		}

		&[data-selected='true'] {
			background: white;
			border: 2px solid var(--button_outline_color);
			border-bottom: none;
		}

		@media (max-width: 600px) {
			font-size: 0.85em;
			padding: 0.6rem 0.25rem;
		}
	}

	[data-no-tab-selected='true'] .tab-button {
		background: var(--button_outline_color);
		color: white;
		border-radius: var(--button_border_radius);
		border: 2px solid var(--button_outline_color);
	}
</style>
