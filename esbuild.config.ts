import { build, context } from 'esbuild'
import { writeFileSync, unlinkSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import sveltePlugin from 'esbuild-svelte'

const is_watch = process.argv.includes('--watch')

const component_arg = process.argv
	.slice(2)
	.find((arg) => !arg.includes('--') && !arg.endsWith('.ts'))

const is_dev_mode = is_watch
const component_path = `${component_arg}.svelte`

const entry_file = 'tmp/_entry.ts'

if (is_dev_mode && component_path) {
	const full_component_path = `../embed/src/${component_path}`

	const entry_content = `import { mount } from 'svelte'
import Component from '${full_component_path}'

const target = document.getElementById('app')
if (target) {
	mount(Component, { target })
} else {
	console.error('Mount point #app not found')
}
`

	mkdirSync(dirname(entry_file), { recursive: true })
	writeFileSync(entry_file, entry_content)
	console.log(`Building component: ${component_path}`)
}

const build_options = {
	entryPoints: [entry_file],
	bundle: true,
	outdir: is_dev_mode ? 'dev' : 'embed/build',
	outbase: is_dev_mode ? 'dev' : undefined,
	entryNames: is_dev_mode ? 'build' : '[name]',
	plugins: [
		sveltePlugin({
			compilerOptions: {
				dev: is_dev_mode,
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
