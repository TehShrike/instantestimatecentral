<script lang="ts" module>
	export type ContactFormData<FieldName extends string = string> = {
		name: string
		email: string
		phone: string
		street_address: string
		extra: {
			[key in FieldName]: string
		}
	}
</script>

<script lang="ts" generics="FieldName extends string">
	import ErrorDisplay from './error_display.svelte'

	type AdditionalField = {
		label: string
		field_name: FieldName
	}

	let {
		submit,
		additional_fields = [],
	}: {
		submit: (data: ContactFormData) => Promise<void>
		additional_fields?: AdditionalField[]
	} = $props()

	let name = $state('')
	let email = $state('')
	let phone = $state('')
	let street_address = $state('')
	let additional_values = $state<Record<FieldName, string>>(
		Object.fromEntries(additional_fields.map(field => [field.field_name, ''])) as Record<FieldName, string>
	)

	let submission_promise = $state<Promise<void> | null>(null)

	const handle_submit = (event: Event) => {
		event.preventDefault()
		submission_promise = submit({
			name,
			email,
			phone,
			street_address,
			extra: additional_values,
		})
	}
</script>

<form onsubmit={handle_submit}>
	<div class="inputs-grid">
		<div class="form-group">
			<label for="contact_name">Name</label>
			<input type="text" id="contact_name" bind:value={name} required />
		</div>

		<div class="form-group">
			<label for="contact_email">Email address</label>
			<input type="email" id="contact_email" bind:value={email} required />
		</div>

		<div class="form-group">
			<label for="contact_phone">Phone number</label>
			<input type="tel" id="contact_phone" bind:value={phone} required />
		</div>

		<div class="form-group">
			<label for="contact_street_address">Street address</label>
			<input type="text" id="contact_street_address" bind:value={street_address} required />
		</div>

		{#each additional_fields as field}
			<div class="form-group">
				<label for="contact_{field.field_name}">{field.label}</label>
				<input type="text" id="contact_{field.field_name}" bind:value={additional_values[field.field_name]} required />
			</div>
		{/each}
	</div>

	<p class="message">
		We'll have an estimator come out in the next business day or two. Our office lady will give you a call in the next 1-2 business hours to schedule the estimator.
	</p>


	{#if submission_promise}
		{#await submission_promise then}
			<div class="success-message">Message sent, we'll get back to you!</div>
		{:catch error}
			<ErrorDisplay {error} />
		{/await}
	{/if}

	<button type="submit" disabled={$effect.pending() > 0}>
		{#if $effect.pending() > 0}
			Submitting...
		{:else}
			Submit
		{/if}
	</button>
</form>

<style>
	form {
		--gap: 1rem;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid #ecf0f1;
	}

	.inputs-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--gap);
	}

	@media (max-width: 600px) {
		.inputs-grid {
			grid-template-columns: 1fr;
		}

		form {
			--gap: 0.5rem;
		}
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		font-weight: 600;
		color: #2c3e50;
		font-size: 1rem;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #bdc3c7;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #3498db;
	}

	.message {
		margin: 0.5rem 0;
		padding: 1rem;
		background-color: #ecf0f1;
		border-radius: 4px;
		font-size: 0.875rem;
		line-height: 1.5;
		color: #2c3e50;
	}

	button {
		padding: 0.75rem 1.5rem;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	@media (max-width: 900px) {
		label {
			font-size: 0.9rem;
		}

		input {
			font-size: 0.9rem;
		}

		.message {
			font-size: 0.8rem;
		}

		button {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 500px) {
		label {
			font-size: 0.85rem;
		}

		input {
			font-size: 0.85rem;
			padding: 0.4rem;
		}

		.message {
			font-size: 0.75rem;
			padding: 0.75rem;
		}

		button {
			font-size: 0.85rem;
			padding: 0.6rem 1rem;
		}
	}

	button:hover {
		background-color: #2980b9;
	}

	button:active {
		background-color: #21618c;
	}

	button:disabled {
		background-color: #95a5a6;
		cursor: not-allowed;
	}

	.success-message {
		color: green;
		margin-top: 1rem;
		padding: 1rem;
		background-color: #d4edda;
		border-radius: 4px;
	}
</style>
