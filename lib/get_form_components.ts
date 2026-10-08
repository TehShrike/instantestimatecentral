import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { for_each_async } from '#lib/array.ts'

type FormComponent = {
	path: string
	service_name: string
	form_name: string
}

export const get_form_components = async (): Promise<FormComponent[]> => {
	const embed_dir = 'embed'
	const entries = await readdir(embed_dir)

	const subdirs: string[] = []
	await for_each_async(entries, async (entry) => {
		const full_path = join(embed_dir, entry)
		const stats = await stat(full_path)
		if (stats.isDirectory()) {
			subdirs.push(entry)
		}
	})

	const components: FormComponent[] = []

	await for_each_async(subdirs, async (subdir) => {
		const subdir_path = join(embed_dir, subdir)
		const files = await readdir(subdir_path)

		await for_each_async(files, async (file) => {
			if (file.endsWith('.svelte')) {
				const file_path = join(subdir_path, file)
				const file_stats = await stat(file_path)
				if (file_stats.isFile()) {
					components.push({
						path: file_path,
						service_name: subdir,
						form_name: file.replace('.svelte', ''),
					})
				}
			}
		})
	})

	return components
}
