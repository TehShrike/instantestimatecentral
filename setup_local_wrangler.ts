import { readFile, writeFile } from 'fs/promises'

const production_config = JSON.parse(await readFile('wrangler.production.json', 'utf-8'))

const local_config = {
	...production_config,
	main: '_worker.js',
	assets: {
		directory: 'build',
		not_found_handling: '404-page',
	},
}

const restore_production_config = async () => {
	await writeFile('wrangler.json', JSON.stringify(production_config, null, '\t') + '\n')
	console.log('Restored wrangler.json to production config')
	process.exit(0)
}

process.on('SIGINT', restore_production_config)
process.on('SIGTERM', restore_production_config)

await writeFile('wrangler.json', JSON.stringify(local_config, null, '\t') + '\n')

console.log('Generated wrangler.json for local development')
console.log('Watching... (will restore production config on exit)')

setInterval(() => {}, 1000 * 60 * 60)
