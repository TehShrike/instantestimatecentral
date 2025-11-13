import { build, context } from 'esbuild'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, basename } from 'path'
import sveltePlugin from 'esbuild-svelte'

const is_watch = process.argv.includes('--watch')

const args = process.argv
	.slice(2)
	.filter((arg) => !arg.includes('--') && !arg.endsWith('.ts'))

const component_arg = args[0]
const output_path = args[1]

if (!component_arg || component_arg.trim() === '') {
	console.error('Error: Component path is required as the first argument')
	process.exit(1)
}

const is_dev_mode = is_watch
const component_path = component_arg.endsWith('.svelte') ? component_arg : `${component_arg}.svelte`
const full_file_path = `embed/${component_path}`

if (!existsSync(full_file_path)) {
	console.error(`Error: Component file not found: ${full_file_path}`)
	process.exit(1)
}

console.log(`Building component: ${component_path}`)

const extract_custom_element_name = (file_path: string): string | null => {
	const content = readFileSync(file_path, 'utf-8')
	const match = content.match(/<svelte:options\s+customElement="([^"]+)"\s*\/>/)
	return match ? match[1] : null
}

if (is_dev_mode) {
	const custom_element_name = extract_custom_element_name(full_file_path)
	if (!custom_element_name) {
		console.error(`Error: Could not find customElement name in ${full_file_path}`)
		process.exit(1)
	}

	const html_path = 'dev/index.html'
	let html_content = readFileSync(html_path, 'utf-8')

	html_content = html_content.replace(
		/(<div id="dev-env-content">)([\s\S]*?)(<\/div>)/,
		`$1\n\t\t\t<${custom_element_name}></${custom_element_name}>\n\t\t$3`
	)

	writeFileSync(html_path, html_content)
	console.log(`Updated dev/index.html to use <${custom_element_name}>`)
}

const output_dir = output_path ? dirname(output_path) : 'build'
const output_name = output_path ? basename(output_path, '.js') : '[name]'

mkdirSync(output_dir, { recursive: true })

const build_options = {
	entryPoints: [full_file_path],
	bundle: true,
	outdir: output_dir,
	entryNames: output_name,
	plugins: [
		sveltePlugin({
			compilerOptions: {
				dev: is_dev_mode,
				customElement: true,
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
} else {
	await build(build_options)
	console.log('Build complete')
}
