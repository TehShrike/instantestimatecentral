<script lang="ts">
	let {
		value = $bindable(1),
		id,
		min = 1,
		max,
	}: {
		value?: number
		id?: string
		min?: number
		max?: number
	} = $props()
</script>

<input type="number" class="number-input" bind:value {id} {min} {max} />

<style>
	.number-input {
		width: 70px;
		height: 36px;
		padding: 0 4px;
		border: 2px solid #d3d3d3;
		border-radius: 4px;
		font-size: 1em;
		font-family: inherit;
		text-align: center;
		background-color: white;
		color: inherit;

		@media (max-width: 600px) {
			width: 50px;
		}
	}

	.number-input:focus {
		outline: 2px solid #0074ff;
		outline-offset: 2px;
		border-color: #0074ff;
	}

	.number-input::-webkit-inner-spin-button,
	.number-input::-webkit-outer-spin-button {
		opacity: 1;
	}
</style>
