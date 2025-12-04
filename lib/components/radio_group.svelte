<script lang="ts" generics="T extends string">
	type Option = {
		label: string
		value: T
	}

	let { options, value = $bindable() }: { options: Option[]; value?: T } = $props()
</script>

<div class="radio-group">
	{#each options as option}
		<label class="radio-label">
			<input type="radio" bind:group={value} value={option.value} />
			{option.label}
		</label>
	{/each}
</div>

<style>
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		@media (max-width: 600px) {
			max-width: max-content;
			min-width: min(100%, 220px);
		}
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-weight: 400;
		color: inherit;
	}

	input[type='radio'] {
		cursor: pointer;
	}
</style>
