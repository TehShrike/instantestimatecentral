import { readFile, writeFile, mkdir, readdir, copyFile } from 'fs/promises'
import { join, dirname, extname } from 'path'
import { for_each_parallel } from '#lib/array.ts'

const is_dev = process.argv.includes('--dev')
const embed_host = is_dev ? 'embed.local.com:1337' : 'embed.instantestimatecentral.com'

const get_all_files = async (dir: string): Promise<string[]> => {
	const entries = await readdir(dir, { withFileTypes: true })
	const files: string[] = []

	await for_each_parallel(entries, async (entry) => {
		const full_path = join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...await get_all_files(full_path))
		} else {
			files.push(full_path)
		}
	})

	return files
}

const source_dir = 'www'
const dest_dir = 'build/www'

console.log('Building www...')

const files = await get_all_files(source_dir)

await for_each_parallel(files, async (source_path) => {
	const relative_path = source_path.slice(source_dir.length + 1)
	const dest_path = join(dest_dir, relative_path)

	await mkdir(dirname(dest_path), { recursive: true })

	if (extname(source_path) === '.html') {
		const content = await readFile(source_path, 'utf-8')
		const transformed = content.replace(/__EMBED_HOST__/g, embed_host)
		await writeFile(dest_path, transformed)
	} else {
		await copyFile(source_path, dest_path)
	}

	console.log(`  ${dest_path}`)
})

console.log('www built')
