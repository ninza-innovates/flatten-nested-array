/**
 * An arbitrarily nested array whose leaves are integers.
 *
 * Arrays may be empty and may nest to any depth. At runtime every visited
 * leaf must pass `Number.isInteger`.
 *
 * @typedef {ReadonlyArray<number | NestedIntegerArray>} NestedIntegerArray
 */

/**
 * Flattens a nested array of integers into a new array.
 *
 * Integers are collected from left to right. The input is not mutated, empty
 * arrays that are flattened contribute no values, and successive calls do not
 * share state. Nesting is walked with an explicit stack, so nesting is not
 * limited by the call stack.
 *
 * @param {NestedIntegerArray} arr An arbitrarily nested array of integers.
 * @param {number} [depth=Infinity] How many levels of nesting to flatten.
 * `Infinity` flattens completely. `0` copies the top level only. A nested
 * array past this limit is the original array and is not validated further.
 * Must be a non-negative integer or `Infinity`.
 * @returns {Array<number | NestedIntegerArray>} Integers from `arr`, in
 * encounter order. Nested arrays remain only where `depth` stops the walk.
 * @throws {TypeError} If `arr` is not an array ("Input must be an array").
 * @throws {TypeError} If `depth` is not a non-negative integer or `Infinity`
 * ("Depth must be a non-negative integer or Infinity").
 * @throws {TypeError} If a visited value is neither an integer nor an array
 * ("Array must contain only integers or nested arrays").
 * @throws {TypeError} If an entered array refers back to itself through the
 * current path ("Array must not contain circular references"). The same
 * nested array may still appear in more than one place. A cycle past
 * `depth` is left in place.
 * @example
 * flattenArray([[1, 2, [3]], 4]);
 * // => [1, 2, 3, 4]
 * @example
 * flattenArray([1, [2, [3, [4]]]], 1);
 * // => [1, 2, [3, [4]]]
 */
function flattenArray(arr, depth = Infinity) {
  if (!Array.isArray(arr)) {
    throw new TypeError("Input must be an array");
  }

  if (depth !== Infinity && !(Number.isInteger(depth) && depth >= 0)) {
    throw new TypeError(
      "Depth must be a non-negative integer or Infinity"
    );
  }

  const result = [];
  const ancestors = new WeakSet();
  const stack = [{ array: arr, index: 0, depth }];
  ancestors.add(arr);

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const { array } = frame;

    if (frame.index >= array.length) {
      ancestors.delete(array);
      stack.pop();
      continue;
    }

    const item = array[frame.index];
    frame.index += 1;

    if (Array.isArray(item)) {
      if (frame.depth === 0) {
        result.push(item);
      } else if (ancestors.has(item)) {
        throw new TypeError("Array must not contain circular references");
      } else {
        ancestors.add(item);
        stack.push({ array: item, index: 0, depth: frame.depth - 1 });
      }
    } else if (Number.isInteger(item)) {
      result.push(item);
    } else {
      throw new TypeError(
        "Array must contain only integers or nested arrays"
      );
    }
  }

  return result;
}

module.exports = flattenArray;

/**
 * Interactive CLI Mode.
 *
 * Reads one JSON value. A successful flatten prints the result and exits 0.
 * Invalid JSON or a value `flattenArray` rejects prints `Error:` on stderr
 * and exits 1, so a script can tell failure from success.
 */
if (require.main === module) {
  const readline = require("readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    'Enter a nested array (example: [[1,2,[3]],4]): ',
    (answer) => {
      try {
        const parsedInput = JSON.parse(answer);
        const result = flattenArray(parsedInput);
        console.log("Flattened Result:", result);
      } catch (error) {
        console.error("Error:", error.message);
        process.exitCode = 1;
      } finally {
        rl.close();
      }
    }
  );
}