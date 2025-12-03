# Writing Tests

Uses Node.js built-in test runner.

## File naming

Test files are named `*.test.ts` and placed next to the file they test.

## Template

```ts
import { test } from 'node:test'
import * as assert from 'node:assert'

test('description of what is being tested', () => {
	const result = some_function()

	assert.strictEqual(result, expected_value)
})
```

## Running tests

```sh
pnpm run test:unit
```

Or run a specific test file:

```sh
node --test path/to/file.test.ts
```

## Common assertions

- `assert.strictEqual(actual, expected)` - strict equality
- `assert.deepStrictEqual(actual, expected)` - deep equality for objects/arrays
- `assert.throws(() => code_that_throws)` - expect an error
