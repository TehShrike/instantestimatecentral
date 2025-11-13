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

# financial-number Library

## Precision

The precision (the number of significant digits after the decimal point) of an operation's result is based on the precision of its inputs.

With multiplication, the number of digits after the decimal point is the sum of the precision of both operands, e.g. `12.00 * 5.0` is `60.000`.

Addition and subtraction always result in the precision of the highest-precision of the operands: `12.00 + 5` is `17.00`.

### Precision general principle

Whenever you need to display or store a number with a specific number of digits after the decimal place, you should explicity set that number to the correct precision before using it in any further calculations.

## Usage in this project

```js
import fnum from '#lib/fnum.ts'

fnum('11.0').minus('9').times('3.75').toString() // => '7.500'
fnum('99.99').times('1.15').gt('100') // => true
```

We use `round` as the default rounding strategy (configured in `lib/fnum.ts`).

## API

- `fnum(string)`

```js
const numberValue = fnum('50.0')
```

Pass in the string representation of a number, get back a financial number object.

Financial numbers are immutable, and functions return a new number object.

Financial number objects have these methods. The operations and comparisons all take strings, or financial number objects.

### Operations

- `numberValue.plus(num)`
- `numberValue.minus(num)`
- `numberValue.times(num)`
- `numberValue.mod(num)`

### Comparisons

They return true or false.

- `numberValue.gt(num)` - greater than
- `numberValue.gte(num)` - greater than or equal
- `numberValue.lt(num)` - less than
- `numberValue.lte(num)` - less than or equal
- `numberValue.equal(num)`

### Other utility methods

#### `numberValue.changePrecision(newPrecision, [roundingStrategy])`

Takes a new precision, and an optional rounding strategy. Returns a new number object.

```js
number('14.556').changePrecision(2, number.trim).toString() // => '14.55'
```

#### `numberValue.toString([displayPrecision, [roundingStrategy]])`

Returns a string representation of the number for display or storage. You can specify the precision and rounding strategy to be passed to `changePrecision` if you like - by default, the number will display at its current precision.

```js
number('99.99').toString() // => '99.99'
```

#### `numberValue.getPrecision()`

```js
number('99.99').getPrecision() // => 2
```

#### `numberValue.isNegative()`

```js
number('13').isNegative() // => false
number('13').times('-1').isNegative() // => true
```

## Helper functions in lib/fnum.ts

### `greatest_of(...numbers)`

Returns the largest of the provided financial numbers.

```js
import { greatest_of } from '#lib/fnum.ts'

greatest_of(number('10'), number('20'), number('15')) // => FinancialNumber representing 20
```

### `increase_by_ratio({ value, ratio })`

Multiplies a value by (1 + ratio). Useful for percentage increases/decreases.

```js
import { increase_by_ratio } from '#lib/fnum.ts'

// Increase by 15%
increase_by_ratio({ value: number('100'), ratio: number('0.15') }) // => FinancialNumber representing 115

// Decrease by 10%
increase_by_ratio({ value: number('100'), ratio: number('-0.10') }) // => FinancialNumber representing 90
```

