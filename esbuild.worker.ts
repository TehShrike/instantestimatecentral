import { build } from 'esbuild'
import { mkdirSync } from 'fs'

const output_dir = 'build'

mkdirSync(output_dir, { recursive: true })

await build({
	entryPoints: ['worker/index.ts'],
	bundle: true,
	outfile: 'build/_worker.js',
	format: 'esm',
	target: 'es2020',
})

console.log('Worker build complete')
