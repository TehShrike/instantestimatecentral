This is a TypeScript project.  All scripts can be executed by node.  The current version of node will automatically strip types by default.

Use pnpm instead of npm.

Here's my prettier config: {"semi": false, "useTabs": true, "singleQuote": true}

Do not write comments explaining what the code is going to do.

Use snake_case for function and variable names, PascalCase for type names.

I prefer arrow function syntax rather than function declarations or function expressions.

I like descriptive TypeScript type names (no one-letter type names for me). I also prefer the bracket syntax over the Array generic.

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

# Svelte 5 State Management Best Practices

## Core Runes
- `$state()` - Creates reactive state. Use for local component state.
- `$derived()` - Creates computed values that update when dependencies change. Use for calculations based on other state.
- `$effect()` - Runs side effects when dependencies change. Use sparingly - prefer derived state when possible.
- `$props()` - Declares component props. Always destructure: `let { prop1, prop2 = 'default' } = $props()`
- `$bindable()` - Makes props two-way bindable. Use for form inputs and shared state between parent/child.

## State Patterns
- Local state: `let count = $state(0)`
- Deep reactive objects: `let user = $state({ name: 'John', settings: { theme: 'dark' } })`
- Non-reactive state: `let data = $state.raw(largeArray)` - use when you don't need deep reactivity
- Computed values: `let doubled = $derived(count * 2)`
- Complex computations: `let result = $derived.by(() => { /* complex logic */ })`

## Component Communication
- Props down: Use `$props()` with destructuring
- Events up: Pass callback functions as props, not event dispatchers
- Two-way binding: Use `$bindable()` for form inputs and shared state
- Example: `let { value = $bindable(), onchange } = $props()`

## Sharing State Across Components
- Create `.svelte.js` files for shared reactive state
- Export functions that return state, not the state directly
- Example pattern:
  ```js
  // state.svelte.js
  let count = $state(0)
  export const get_count = () => count
  export const set_count = (value) => { count = value }
  export const increment = () => count++
  ```

## Effect Guidelines
- Use `$effect()` only for side effects (DOM manipulation, network calls, subscriptions)
- Don't update state inside effects unless absolutely necessary
- Return cleanup functions for subscriptions/timers
- Use `$effect.pre()` for DOM updates that need to happen before rendering
- Use `untrack()` to exclude dependencies from tracking: `untrack(() => someState)`
- Avoid infinite loops by using `untrack()` when reading state you also write to

## Advanced State Utilities
- `$state.raw()` - Non-reactive state for performance with large objects/arrays that won't be mutated
- `$state.snapshot()` - Take a static snapshot of reactive state for logging or external APIs
- `untrack()` - Read state without creating a dependency in effects/derived values
- Reactive built-ins: Import reactive `Set`, `Map`, `Date`, `URL` from `svelte/reactivity`

## Performance Tips
- Use `$state.raw()` for large data that doesn't need reactivity
- Use `$derived()` instead of `$effect()` for computed values (90% of the time you want derived)
- Avoid deep nesting in reactive objects if not needed
- Use `$state.snapshot()` when passing state to external libraries

## Debugging State
- Use `$inspect(value)` to log state changes during development
- Use `$state.snapshot()` for one-off logging instead of `console.log(state)`
- Browser devtools show proxies, not actual values - snapshots show real values

Don't forget, we're writing Svelte 5 with runes and stuff now, not Svelte 3 or 4.

