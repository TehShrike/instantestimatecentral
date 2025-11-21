import { build, context } from 'esbuild'
import { mkdirSync, readFileSync } from 'fs'
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

const entry_points: Record<string, string> = {}
for_each(components, (component) => {
	const output_key = `${component.service_name}/${component.form_name}`
	entry_points[output_key] = component.path
})

console.log('Building components:')
for_each(components, (component) => {
	console.log(`  ${component.path} -> build/embed/${component.service_name}/${component.form_name}.js`)
})

mkdirSync('build/embed', { recursive: true })

const dev = is_watch
const compiler_options: CompileOptions = {
	dev,
	customElement: true,
}

const CF_TURNSTILE_SITE_KEY='0x4AAAAAACB5D9NkFrU62jG9'
const api_host = dev ? 'https://executor.local.com:1337' : 'https://executor.instantestimatecentral.com'

const build_options = {
	entryPoints: entry_points,
	bundle: true,
	outdir: 'build/embed',
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
		'__CF_TURNSTILE_SITE_KEY__': JSON.stringify(CF_TURNSTILE_SITE_KEY),
		'__IS_DEV__': JSON.stringify(dev),
	},
}

if (is_watch) {
	const ctx = await context(build_options)
	await ctx.watch()
	console.log('Watching for changes...')
} else {
	await build(build_options)
	console.log('Build complete')
}
