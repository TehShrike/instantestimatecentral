<script lang="ts">
	let { error }: { error: unknown } = $props()

	const error_message = $derived(() => {
		if (!error) {
			return null
		}
		if (error instanceof Error) {
			return error.message
		}
		return String(error)
	})
</script>

{#if error_message()}
	<div class="error-display">
		{error_message()}
	</div>
{/if}

<style>
	.error-display {
		color: red;
		margin-top: 1rem;
		padding: 1rem;
	}
</style>
