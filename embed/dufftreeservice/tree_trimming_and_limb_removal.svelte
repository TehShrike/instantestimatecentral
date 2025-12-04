<svelte:options customElement="tree-trimming-and-limb-removal" />

<script lang="ts">
	import Tabs, { type Tab } from '#lib/tabs.svelte'
	import PricingWrapper from '#lib/pricing_wrapper.svelte'
	import ContactForm, { type AdditionalField } from '#lib/contact_form.svelte'
	import type { ContactForm as ContactFormData } from '#lib/contact_form.d.ts'
	import { get, set } from '#lib/localstorage.ts'
	import LimbRemovalForm from './forms/limb_removal_form.svelte'
	import TreeTrimmingForm from './forms/tree_trimming_form.svelte'
	import send_estimate_email from './send_estimate_email.ts'
	import { get_limb_removal_initial_args, get_tree_trimming_initial_args } from './get_initial_args.ts'
	import { services, type ServiceProgrammaticName } from '#companies/dufftreeservice/index.ts'
	import VerticalColumnWithGap from '#lib/vertical_column_with_gap.svelte'
	import { one_of, exact } from '#lib/json_validator.ts'

	const tabs: Tab<ServiceProgrammaticName>[] = [
		{
			name: 'Tree Trimming',
			content: tree_trimming_content,
			identifier: 'tree_trimming',
		},
		{
			name: 'Limb Removal',
			content: limb_removal_content,
			identifier: 'limb_removal',
		},
	]

	let current_tab_identifier = $state<Extract<ServiceProgrammaticName, 'tree_trimming' | 'limb_removal'>>(
		get(
			'tree_trimming_and_limb_removal_current_tab_identifier',
			one_of(exact('tree_trimming' as const), exact('limb_removal' as const)),
			'tree_trimming',
		),
	)

	let pricing_args = $state({
		limb_removal: get_limb_removal_initial_args(),
		tree_trimming: get_tree_trimming_initial_args(),
	})

	const on_submit = (contact: ContactFormData<string>, turnstile_token: string | null) =>
		send_estimate_email({
			service_name: current_tab_identifier,
			pricing_args: pricing_args[current_tab_identifier],
			contact,
			turnstile_token,
		})

	$effect(() => set('all_services_current_tab_identifier', current_tab_identifier))
</script>

<PricingWrapper>
	<Tabs bind:current_tab_identifier {tabs} />
	<ContactForm submit={on_submit} />
</PricingWrapper>

{#snippet limb_removal_content()}
	<VerticalColumnWithGap>
		<LimbRemovalForm pricing={services.limb_removal.pricing} bind:pricing_args={pricing_args.limb_removal} />
	</VerticalColumnWithGap>
{/snippet}

{#snippet tree_trimming_content()}
	<VerticalColumnWithGap>
		<TreeTrimmingForm pricing={services.tree_trimming.pricing} bind:pricing_args={pricing_args.tree_trimming} />
	</VerticalColumnWithGap>
{/snippet}
