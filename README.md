# Flatten Nested Array

[![CI](https://github.com/ninza-innovates/flatten-nested-array/actions/workflows/ci.yml/badge.svg)](https://github.com/ninza-innovates/flatten-nested-array/actions/workflows/ci.yml)

A production-ready Node.js implementation to flatten an arbitrarily
nested array of integers into a single flat array.

This project includes:

-   Clean and idiomatic JavaScript implementation\
-   Interactive CLI support\
-   Strict input validation\
-   Comprehensive Jest unit tests\
-   Professional project structure

------------------------------------------------------------------------

## 📌 Problem Statement

Given an array that may contain nested arrays of integers, return a flat
array of integers.

### Example

**Input:**

    [[1, 2, [3]], 4]

**Output:**

    [1, 2, 3, 4]

The solution must:

-   Handle arbitrarily deep nesting\
-   Accept only integers\
-   Throw errors for invalid inputs\
-   Maintain clean and predictable behavior

------------------------------------------------------------------------

## 🛠 Installation

Clone the repository:

``` bash
git clone https://github.com/ninza-innovates/flatten-nested-array.git
cd flatten-nested-array
```

Install dependencies:

``` bash
npm install
```

------------------------------------------------------------------------

## 📖 Usage

`flattenArray` is exported from `src/flattenArray.js`. Requiring the module
does not start the interactive prompt.

``` javascript
const flattenArray = require("./src/flattenArray");

flattenArray([[1, 2, [3]], 4]);
// [1, 2, 3, 4]

flattenArray([1, [2, [3, [4, [5]]]]]);
// [1, 2, 3, 4, 5]

flattenArray([[-1, 0, [-3]], 4]);
// [-1, 0, -3, 4]

flattenArray([1, [2, [3, [4]]]], 1);
// [1, 2, [3, [4]]]

const input = [1, [], [2, [[]]]];
const flat = flattenArray(input);
// flat is [1, 2]
// input is still [1, [], [2, [[]]]]
```

Values that are not integers, arrays that loop back to an ancestor, and an
invalid depth throw `TypeError`:

``` javascript
flattenArray("nope");
// TypeError: Input must be an array

flattenArray([1, [2.5]]);
// TypeError: Array must contain only integers or nested arrays

const cycle = [1];
cycle.push(cycle);
flattenArray(cycle);
// TypeError: Array must not contain circular references

flattenArray([1, [2]], -1);
// TypeError: Depth must be a non-negative integer or Infinity
```

A nested array can appear in more than one place:

``` javascript
const inner = [1, [2]];
flattenArray([inner, 3, inner]);
// [1, 2, 3, 1, 2]
```

------------------------------------------------------------------------

## 📘 API

### `flattenArray(arr, depth = Infinity)`

``` javascript
flattenArray(arr, depth) // => Array<number | array>
```

Returns a new array of the integers in `arr`, from left to right, flattening
at most `depth` levels. `depth` defaults to `Infinity`, which flattens every
level, so a one-argument call keeps the previous behavior. `arr` may contain
integers and arrays nested to any depth, including empty arrays. Empty arrays
that are flattened contribute no values. The input is not mutated, and later
calls do not reuse an earlier result.

`depth` must be a non-negative integer or `Infinity`. `0` copies the top
level only. A nested array left in the result is the same array that was
passed in; its contents are not validated. Fractional, negative, and
non-numeric depths throw.

`arr` must be a real array. Array-like objects are rejected. Array
subclasses are flattened the same way as plain arrays. A visited leaf is
kept only when `Number.isInteger` is true, including `0`, negative integers,
and the safe integer bounds. Fractional numbers, `NaN`, `Infinity`, strings,
`null`, `undefined`, booleans, bigints, and sparse holes throw when they are
visited. Values nested deeper than `depth` are not visited.

`flattenArray` throws `TypeError` in four cases:

-   `arr` is not an array — `Input must be an array`
-   `depth` is not a non-negative integer or `Infinity` —\
    `Depth must be a non-negative integer or Infinity`
-   A visited value is neither an integer nor an array —\
    `Array must contain only integers or nested arrays`
-   An entered array refers back to an ancestor on the path currently\
    being walked — `Array must not contain circular references`

The same nested array may appear in more than one place. Each appearance
that is entered is flattened. Only a reference back to an ancestor is
circular. A cycle deeper than `depth` is left in place.

``` javascript
flattenArray([1, [2, [3, [4]]]], 1);
// [1, 2, [3, [4]]]

flattenArray([1, [2, [3, [4]]]], 0);
// [1, [2, [3, [4]]]]
```

Nesting is walked with an explicit stack, so nesting is limited by memory
rather than the call stack.

TypeScript callers are typed by `src/flattenArray.d.ts`. The input type is
`flattenArray.NestedIntegerArray`. TypeScript has no integer type, so
leaves are declared as `number`; the runtime still requires
`Number.isInteger` for every leaf it visits. Passing `depth` types the
result as an array that may still contain nested arrays. Omitting `depth`
types the result as `number[]`.

------------------------------------------------------------------------

## ▶️ Running the Application

To run the application in interactive mode:

``` bash
npm start
```

or

``` bash
npm run start
```

After running the command, you will see:

    Enter a nested array (example: [[1,2,[3]],4]):

Enter your input (must be valid JSON format).

**Example input:**

    [[1,2,[3]],4]

**Example output:**

    Flattened Result: [ 1, 2, 3, 4 ]

The printed array includes every element, including results longer than 100 integers.

A terminal session reads the single line entered at the prompt. Ctrl+D with nothing typed, and a terminal that closes before Enter, count as empty input. Text already typed when that happens is parsed. Ctrl+C cancels the prompt and exits 130. Piped input is read until end of file as one JSON value, so a pretty-printed array works and a trailing newline is optional. Empty input, invalid JSON, and text after that JSON value print `Error:` on stderr and exit 1.

------------------------------------------------------------------------

## 🧪 Running Tests

To execute unit tests:

``` bash
npm test
```

If everything is working correctly, you should see all tests passing.

------------------------------------------------------------------------

## ✅ Example Inputs You Can Try

### 1. Deeply Nested

    [1,[2,[3,[4,[5]]]]]

Expected output:

    [1, 2, 3, 4, 5]

------------------------------------------------------------------------

### 2. Mixed Nested Structure

    [[1,[2,3]],[4,[5,[6]]],7]

Expected output:

    [1, 2, 3, 4, 5, 6, 7]

------------------------------------------------------------------------

### 3. Negative Numbers

    [[-1,2,[-3]],4]

Expected output:

    [-1, 2, -3, 4]

------------------------------------------------------------------------

### 4. Empty Array

    []

Expected output:

    []

------------------------------------------------------------------------

## 📁 Project Structure

    flatten-nested-array/
    │
    ├── src/
    │   ├── flattenArray.js
    │   └── flattenArray.d.ts
    │
    ├── tests/
    │   ├── flattenArray.test.js
    │   └── cli.test.js
    │
    ├── .github/workflows/ci.yml
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

------------------------------------------------------------------------

## 🧠 Approach

The solution walks the input with an explicit stack, so nesting is not
limited by the call stack:

-   If the element is an integer → push it to the result\
-   If the element is an array and the depth limit allows it → visit it next\
-   If a nested array sits past the depth limit → keep that array\
-   If an array refers back to an ancestor → throw a TypeError\
-   If invalid data is encountered → throw a TypeError

The core flattening logic is separated from the CLI interface to
maintain testability and clean design.

------------------------------------------------------------------------

## ⏱ Complexity

**Time Complexity:** O(v)\
**Space Complexity:** O(v)

Where `v` is the number of values visited. A full flatten visits every
element. A finite `depth` stops once that many levels are flattened.

------------------------------------------------------------------------

## 🧰 Tech Stack

-   Node.js\
-   Jest

------------------------------------------------------------------------

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, how to run the tests, and the behavior a change should preserve.

------------------------------------------------------------------------

## 📌 Notes

-   Input must be valid JSON format\
-   Only integers are supported at levels the walk visits\
-   An optional depth limits how many levels are flattened\
-   Circular references throw a TypeError when they are entered\
-   Designed to follow production-quality coding standards
