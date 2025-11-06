import { build } from 'esbuild'

const output_dir = 'build'

await build({
	entryPoints: ['worker/index.ts'],
	bundle: true,
	outfile: 'build/_worker.js',
	format: 'esm',
	target: 'es2020',
})

console.log('Worker build complete')
