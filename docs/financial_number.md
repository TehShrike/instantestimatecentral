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
