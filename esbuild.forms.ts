import { build, context } from 'esbuild'
import { mkdirSync } from 'fs'
import type { CompileOptions } from "svelte/compiler";
import sveltePlugin from 'esbuild-svelte'
import { get_form_components } from '#lib/get_form_components.ts'
import { for_each } from '#lib/array.ts'

const is_watch = process.argv.includes('--watch')

const components = await get_form_components()

if (components.length === 0) {
	console.error('No .svelte files found in embed subdirectories')
	process.exit(1)
}

const components_by_service = new Map<string, Record<string, string>>()
for_each(components, (component) => {
	if (!components_by_service.has(component.service_name)) {
		components_by_service.set(component.service_name, {})
	}
	components_by_service.get(component.service_name)![component.form_name] = component.path
})

console.log('Building components:')
for_each(components, (component) => {
	console.log(`  ${component.path} -> build/embed/${component.service_name}/${component.form_name}.js`)
})

const dev = is_watch
const compiler_options: CompileOptions = {
	dev,
	customElement: true,
}

const api_host = dev ? 'https://executor.local.com:1337' : 'https://executor.instantestimatecentral.com'

const service_names = [...components_by_service.keys()]

for_each(service_names, (service_name) => {
	mkdirSync(`build/embed/${service_name}`, { recursive: true })
})

const get_build_options = (service_name: string) => ({
	entryPoints: components_by_service.get(service_name)!,
	bundle: true,
	splitting: true,
	outdir: `build/embed/${service_name}`,
	plugins: [
		// @ts-expect-error - not sure what's up with TS not picking up the types
		sveltePlugin({
			compilerOptions: compiler_options,
		}),
	],
	format: 'esm' as const,
	target: 'es2020',
	define: {
		'__API_HOST__': JSON.stringify(api_host),
		'__IS_DEV__': JSON.stringify(dev),
	},
})

if (is_watch) {
	await Promise.all(service_names.map(async (service_name) => {
		const ctx = await context(get_build_options(service_name))
		await ctx.watch()
	}))
	console.log('Watching for changes...')
} else {
	await Promise.all(service_names.map((service_name) => build(get_build_options(service_name))))
	console.log('Build complete')
}
