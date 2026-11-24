# Contributing

This guide covers local setup, the checks CI runs, and the behavior changes need to preserve.

## Prerequisites

- Git
- Node.js 26, the Active LTS release used by [CI](.github/workflows/ci.yml)
- npm, which ships with Node.js

Check the installed runtime with `node -v`.

## Setup

```bash
git clone https://github.com/ninza-innovates/flatten-nested-array.git
cd flatten-nested-array
npm install
```

`npm ci` installs exactly the versions in `package-lock.json`. That is the install CI uses.

## Tests

```bash
npm test
```


Jest loads `tests/flattenArray.test.js` and `tests/cli.test.js`. The library tests cover nesting (including chains deeper than the call stack), empty arrays, integer bounds, rejected values, and circular references. The CLI tests spawn `src/flattenArray.js` and check stdout, stderr, and the exit code.

Add or update a test when you change behavior. `npm test` should pass before you open a pull request.

## Running the CLI

```bash
npm start
```

The prompt reads one JSON value. A nested array of integers prints `Flattened Result:` and the process exits 0. Invalid JSON, a non-array value, or a non-integer element prints `Error:` on stderr and the process exits 1. Requiring the module from other code does not start the prompt.

## Project layout

- `src/flattenArray.js` — implementation and the interactive CLI
- `src/flattenArray.d.ts` — TypeScript declaration; keep it aligned with the runtime contract
- `tests/` — Jest tests
- `.github/workflows/ci.yml` — runs `npm ci` and `npm test` on Node.js 26 for every push and pull request

## Behavior to preserve

`flattenArray` returns a new array and does not mutate its input.

- The first argument must be an array. Otherwise throw `TypeError` with the message `Input must be an array`.
- An optional `depth` limits how many levels are flattened. It defaults to `Infinity`. `0` copies the top level only. `depth` must be a non-negative integer or `Infinity`; otherwise throw `TypeError` with the message `Depth must be a non-negative integer or Infinity`. Arrays past that limit are returned as they were passed and are not validated further.
- Every visited leaf must pass `Number.isInteger`. Otherwise throw `TypeError` with the message `Array must contain only integers or nested arrays`.
- An array that appears again on the current path throws `TypeError` with the message `Array must not contain circular references`. The same nested array may appear in more than one place when that does not form a cycle. A cycle past `depth` is left in place.
- Empty arrays that are flattened contribute no values. Integers stay in left-to-right order.

## License

This project is released under the MIT License. See [LICENSE](LICENSE).
