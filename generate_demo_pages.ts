import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import { get_form_components } from '#lib/get_form_components.ts'
import { for_each_async } from '#lib/array.ts'

const extract_custom_element_name = (content: string): string | null => {
	const match = content.match(/<svelte:options\s+customElement="([^"]+)"\s*\/>/)
	return match?.[1] ?? null
}

const generate_html = (custom_element_name: string, service_name: string, form_name: string, embed_host: string): string => {
	return `<!DOCTYPE html>
<html lang="en">

	<head>
		<title>${service_name} - ${form_name} | Instant Estimate Central</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			body {
				padding: 0;
				margin: 0;
			}

			#dev-env-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 100%;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
				padding-bottom: 200px;
			}
		</style>
	</head>

	<body>
		<div id="dev-env-content">
			<${custom_element_name}></${custom_element_name}>
		</div>
		<script type="module" src="//${embed_host}/${service_name}/${form_name}.js"></script>
	</body>
</html>
`
}

const components = await get_form_components()

const is_dev = process.argv.includes('--dev')
const embed_host = is_dev ? 'embed.local.com:1337' : 'embed.instantestimatecentral.com'

console.log('Generating demo pages...')

await for_each_async(components, async (component) => {
	const content = await readFile(component.path, 'utf-8')
	const custom_element_name = extract_custom_element_name(content)

	if (!custom_element_name) {
		console.warn(`Warning: Could not find customElement name in ${component.path}`)
		return
	}

	const html = generate_html(custom_element_name, component.service_name, component.form_name, embed_host)

	const output_path = `build/www/demo/${component.service_name}/${component.form_name}.html`
	await mkdir(dirname(output_path), { recursive: true })
	await writeFile(output_path, html)

	console.log(`  ${output_path}`)
})

console.log('Demo pages generated')
