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

const input = [1, [], [2, [[]]]];
const flat = flattenArray(input);
// flat is [1, 2]
// input is still [1, [], [2, [[]]]]
```

Values that are not integers, and arrays that loop back to an ancestor,
throw `TypeError`:

``` javascript
flattenArray("nope");
// TypeError: Input must be an array

flattenArray([1, [2.5]]);
// TypeError: Array must contain only integers or nested arrays

const cycle = [1];
cycle.push(cycle);
flattenArray(cycle);
// TypeError: Array must not contain circular references
```

A nested array can appear in more than one place:

``` javascript
const inner = [1, [2]];
flattenArray([inner, 3, inner]);
// [1, 2, 3, 1, 2]
```

TypeScript callers are typed by `src/flattenArray.d.ts`.

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
    ├── LICENSE
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

------------------------------------------------------------------------

## 🧠 Approach

The solution uses a recursive strategy:

-   If the element is an integer → push it to the result\
-   If the element is an array → recursively process it\
-   If an array refers back to an ancestor → throw a TypeError\
-   If invalid data is encountered → throw a TypeError

The core flattening logic is separated from the CLI interface to
maintain testability and clean design.

------------------------------------------------------------------------

## ⏱ Complexity

**Time Complexity:** O(n)\
**Space Complexity:** O(n)

Where `n` is the total number of elements across all nested arrays.

------------------------------------------------------------------------

## 🧰 Tech Stack

-   Node.js\
-   Jest

------------------------------------------------------------------------

## 📌 Notes

-   Input must be valid JSON format\
-   Only integers are supported\
-   Circular references throw a TypeError\
-   Designed to follow production-quality coding standards
