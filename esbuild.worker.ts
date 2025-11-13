import { build, context } from 'esbuild'

const watch = process.argv.includes('--watch')

const build_options = {
	entryPoints: ['worker/index.ts'],
	bundle: true,
	outfile: 'build/_worker.js',
	format: 'esm',
	target: 'es2020',
} as const

if (watch) {
	const ctx = await context(build_options)
	await ctx.watch()
	console.log('Watching worker for changes...')
} else {
	await build(build_options)
	console.log('Worker build complete')
}
