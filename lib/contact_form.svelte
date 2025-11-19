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
	<p>
		Want us to come out and give you a free quote?
	</p>

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
		Our office lady will give you a call in the next 1-2 business hours to schedule the visit.  An estimator will come out in the next business day or two.
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
	p {
		margin: 0;
	}
	form {
		--gap: 1rem;
		display: flex;
		flex-direction: column;
		gap: var(--gap);

		@media (max-width: 600px) {
			--gap: 0.5rem;
		}
	}

	.inputs-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--gap);

		@media (max-width: 600px) {
			grid-template-columns: 1fr;
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
		font-size: 1em;

		@media (max-width: 900px) {
			font-size: 0.9em;
		}

		@media (max-width: 500px) {
			font-size: 0.85em;
		}
	}

	input {
		padding: 0.5rem;
		border: 1px solid #bdc3c7;
		border-radius: 4px;
		font-size: 1em;

		&:focus {
			outline: none;
			border-color: #3498db;
		}

		@media (max-width: 900px) {
			font-size: 0.9em;
		}

		@media (max-width: 500px) {
			font-size: 0.85em;
			padding: 0.4rem;
		}
	}

	.message {
		padding: 1rem;
		background-color: #ecf0f1;
		border-radius: 4px;
		font-size: 0.875em;
		line-height: 1.5;
		color: #2c3e50;

		@media (max-width: 900px) {
			font-size: 0.8em;
		}

		@media (max-width: 500px) {
			font-size: 0.75em;
			padding: 0.75rem;
		}
	}

	button {
		padding: 0.75rem 1.5rem;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;

		&:hover {
			background-color: #2980b9;
		}

		&:active {
			background-color: #21618c;
		}

		&:disabled {
			background-color: #95a5a6;
			cursor: not-allowed;
		}

		@media (max-width: 900px) {
			font-size: 0.9em;
		}

		@media (max-width: 500px) {
			font-size: 0.85em;
			padding: 0.6rem 1rem;
		}
	}

	.success-message {
		color: green;
		margin-top: 1rem;
		padding: 1rem;
		background-color: #d4edda;
		border-radius: 4px;
	}
</style>
