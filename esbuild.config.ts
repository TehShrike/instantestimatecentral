import { build, context } from 'esbuild'
import { writeFileSync, unlinkSync, mkdirSync } from 'fs'
import { join, dirname, basename } from 'path'
import sveltePlugin from 'esbuild-svelte'

const is_watch = process.argv.includes('--watch')

const args = process.argv
	.slice(2)
	.filter((arg) => !arg.includes('--') && !arg.endsWith('.ts'))

const component_arg = args[0]
const output_path = args[1]

const is_dev_mode = is_watch
const component_path = component_arg?.endsWith('.svelte') ? component_arg : `${component_arg}.svelte`

const entry_file = 'tmp/_entry.ts'

if (component_path && component_arg) {
	const full_component_path = `../embed/src/${component_path}`

	const entry_content = `import { mount } from 'svelte'
import Component from '${full_component_path}'

mount(Component, {
	target: document.getElementById('app'),
})
`

	mkdirSync(dirname(entry_file), { recursive: true })
	writeFileSync(entry_file, entry_content)
	console.log(`Building component: ${component_path}`)
}

const output_dir = output_path ? dirname(output_path) : 'embed/build'
const output_name = output_path ? basename(output_path, '.js') : '[name]'

mkdirSync(output_dir, { recursive: true })

const build_options = {
	entryPoints: [entry_file],
	bundle: true,
	outdir: output_dir,
	entryNames: output_name,
	plugins: [
		sveltePlugin({
			compilerOptions: {
				dev: is_dev_mode,
				css: 'injected'
			},
		}),
	],
	format: 'esm' as const,
	target: 'es2020',
}

if (is_watch) {
	const ctx = await context(build_options)
	await ctx.watch()
	console.log('Watching for changes...')

	if (is_dev_mode) {
		process.on('SIGINT', () => {
			unlinkSync(entry_file)
			process.exit()
		})
	}
} else {
	await build(build_options)
	console.log('Build complete')

	if (is_dev_mode) {
		unlinkSync(entry_file)
	}
}
