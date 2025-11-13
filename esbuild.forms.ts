import { build, context } from 'esbuild'
import { mkdirSync } from 'fs'
import type { CompileOptions } from "svelte/compiler";
import sveltePlugin from 'esbuild-svelte'
import { get_form_components } from '#lib/get_form_components.ts'

const is_watch = process.argv.includes('--watch')

const components = await get_form_components()

if (components.length === 0) {
	console.error('No .svelte files found in embed subdirectories')
	process.exit(1)
}

const entry_points: Record<string, string> = {}
for (const component of components) {
	const output_key = `${component.service_name}/${component.form_name}`
	entry_points[output_key] = component.path
}

console.log('Building components:')
for (const component of components) {
	console.log(`  ${component.path} -> build/embed/${component.service_name}/${component.form_name}.js`)
}

mkdirSync('build/embed', { recursive: true })

const compiler_options: CompileOptions = {
	dev: is_watch,
	customElement: true,
}

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
}

if (is_watch) {
	const ctx = await context(build_options)
	await ctx.watch()
	console.log('Watching for changes...')
} else {
	await build(build_options)
	console.log('Build complete')
}
