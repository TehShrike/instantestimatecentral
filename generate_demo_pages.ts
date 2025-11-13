import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import { get_form_components } from '#lib/get_form_components.ts'

const extract_custom_element_name = (content: string): string | null => {
	const match = content.match(/<svelte:options\s+customElement="([^"]+)"\s*\/>/)
	return match?.[1] ?? null
}

const generate_html = (custom_element_name: string, service_name: string, form_name: string): string => {
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
			}
		</style>
	</head>

	<body>
		<div id="dev-env-content">
			<${custom_element_name}></${custom_element_name}>
		</div>
		<script type="module">
			const script_url = \`https://embed.\${location.hostname}/${service_name}/${form_name}.js\`
			import(script_url)
		</script>
	</body>
</html>
`
}

const components = await get_form_components()

console.log('Generating demo pages...')

for (const component of components) {
	const content = await readFile(component.path, 'utf-8')
	const custom_element_name = extract_custom_element_name(content)

	if (!custom_element_name) {
		console.warn(`Warning: Could not find customElement name in ${component.path}`)
		continue
	}

	const html = generate_html(custom_element_name, component.service_name, component.form_name)

	const output_path = `build/demo/${component.service_name}/${component.form_name}.html`
	await mkdir(dirname(output_path), { recursive: true })
	await writeFile(output_path, html)

	console.log(`  ${output_path}`)
}

console.log('Demo pages generated')
