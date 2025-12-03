<script lang="ts" module>
	declare const __IS_DEV__: boolean

	export type AdditionalField<FieldName extends string = string> = {
		label: string
		field_name: FieldName
	}
</script>

<script lang="ts" generics="FieldName extends string">
	import ErrorDisplay from './error_display.svelte'
	import CloudflareTurnstile from './cloudflare_turnstile.svelte'
	import { get, set } from '#lib/localstorage.ts'
	import { object, is_string } from '#lib/json_validator.ts'
	import type { ContactForm } from '#lib/contact_form.d.ts'
	import type { Validator } from './json_validator.ts'

	let {
		submit,
		additional_fields = [],
	}: {
		submit: (data: ContactForm<FieldName>, turnstile_token: string | null) => Promise<void>
		additional_fields?: AdditionalField<FieldName>[]
	} = $props()

	const common_data_validator = object({
		name: is_string,
		email: is_string,
		phone: is_string,
		street_address: is_string,
	})

	// svelte-ignore state_referenced_locally
	const additional_values_validator = object(
		Object.fromEntries(additional_fields.map((field) => [field.field_name, is_string])),
	) as Validator<Record<FieldName, string>>

	const default_common_data: Pick<ContactForm<FieldName>, 'name' | 'email' | 'phone' | 'street_address'> = {
		name: '',
		email: '',
		phone: '',
		street_address: '',
	}

	// svelte-ignore state_referenced_locally
	const default_additional_values = Object.fromEntries(
		additional_fields.map((field) => [field.field_name, '']),
	) as Record<FieldName, string>

	// svelte-ignore state_referenced_locally
	const additional_fields_key =
		'contact_form_additional_' +
		additional_fields
			.map((f) => f.field_name)
			.sort()
			.join('_')

	let common_data = $state(get('contact_form_data', common_data_validator, default_common_data))
	let additional_values = $state(get(additional_fields_key, additional_values_validator, default_additional_values))

	let submission_promise = $state<Promise<void> | null>(null)
	let turnstile_token = $state<string | null>(null)

	$effect(() => set('contact_form_data', common_data))
	$effect(() => set(additional_fields_key, additional_values))

	const handle_submit = (event: Event) => {
		event.preventDefault()

		submission_promise = submit(
			{
				...common_data,
				extra: additional_values,
			},
			turnstile_token,
		)
	}

	const TURNSTILE_DISABLED_FOR_NOW = true
	let form_is_valid = $derived(__IS_DEV__ || TURNSTILE_DISABLED_FOR_NOW || turnstile_token !== null)
</script>

<form onsubmit={handle_submit}>
	<p>Want us to come out and give you a free quote?</p>

	<div class="inputs-grid">
		<div class="form-group">
			<label for="contact_name">Name</label>
			<input type="text" id="contact_name" bind:value={common_data.name} required />
		</div>

		<div class="form-group">
			<label for="contact_email">Email address</label>
			<input type="email" id="contact_email" bind:value={common_data.email} required />
		</div>

		<div class="form-group">
			<label for="contact_phone">Phone number</label>
			<input type="tel" id="contact_phone" bind:value={common_data.phone} required />
		</div>

		<div class="form-group">
			<label for="contact_street_address">Street address</label>
			<input type="text" id="contact_street_address" bind:value={common_data.street_address} required />
		</div>

		{#each additional_fields as field}
			<div class="form-group">
				<label for="contact_{field.field_name}">{field.label}</label>
				<input type="text" id="contact_{field.field_name}" bind:value={additional_values[field.field_name]} required />
			</div>
		{/each}
	</div>

	<p class="message">
		Our office lady will give you a call in the next 1-2 business hours to schedule the visit. An estimator will come
		out in the next business day or two.
	</p>

	{#if !__IS_DEV__ && !TURNSTILE_DISABLED_FOR_NOW}
		<CloudflareTurnstile bind:token={turnstile_token} />
	{/if}

	{#if submission_promise}
		{#await submission_promise then}
			<div class="success-message">Message sent, we'll get back to you!</div>
		{:catch error}
			<ErrorDisplay {error} />
		{/await}
	{/if}

	<button type="submit" disabled={$effect.pending() > 0 || !form_is_valid}>
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
