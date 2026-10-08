This is a TypeScript project.  All scripts can be executed by node.  The current version of node will automatically strip types by default.

Use pnpm instead of npm.

Do not write comments explaining what the code is going to do.

Use snake_case for function and variable names, PascalCase for type names.

I prefer arrow function syntax rather than function declarations or function expressions.

I like descriptive TypeScript type names (no one-letter type names for me). I also prefer the bracket syntax over the Array generic.

Don't define a variable right before using it only once – inline the value instead.

Run `pnpm run test:types` to check whether the types are correct.  `pnpm run test:unit` will run the unit tests.  `pnpm run test` will run everything.

# AST-Grep (sg) Usage

You run in an environment where ast-grep (sg) is available. Use it for syntax-aware structural matching instead of text-only tools.

## Basic Usage
- `sg run -l <lang> -p '<pattern>'` - Search with pattern
- `sg` (alias for `sg run`) - Basic search command

## Supported Languages
Key languages: typescript/ts, javascript/js, python/py, c, cpp, rust, go, java, ruby/rb, bash, yaml, json

## Pattern Syntax
- Metavariables: `$VAR` (matches single node), `$$$ARGS` (matches zero or more)
- Examples:
  - `console.log($MSG)` - matches console.log calls
  - `function $NAME($$$PARAMS) { $$$ }` - matches function declarations
  - `$OBJ.$PROP` - matches property access
  - `"$KEY": $VALUE` - matches JSON key-value pairs

## Common Use Cases
- Find function calls: `sg -l ts -p 'functionName($$$)'`
- Find object properties: `sg -l json -p '"$KEY": $VALUE'`
- Find imports: `sg -l ts -p 'import $$ from "$MODULE"'`
- Find type definitions: `sg -l ts -p 'type $NAME = $TYPE'`

Use ast-grep instead of grep/rg when you need structural code matching.

# Tests

See [docs/tests.md](docs/tests.md)

# financial-number Library

See [docs/financial_number.md](docs/financial_number.md)

# HTML and CSS

Don't use margin for adding whitespace between elements, use `display: flex` and a `gap` on the parent element.

# Iteration

Use the functions in lib/array.ts when possible.  Avoid using for..of for iteration if an array function with a callback can be used instead.
