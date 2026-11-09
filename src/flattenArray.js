/**
 * An arbitrarily nested array whose leaves are integers.
 *
 * Arrays may be empty and may nest to any depth. At runtime every leaf
 * must pass `Number.isInteger`.
 *
 * @typedef {ReadonlyArray<number | NestedIntegerArray>} NestedIntegerArray
 */

/**
 * Flattens an arbitrarily nested array of integers into a new array.
 *
 * Integers are collected from left to right. The input is not mutated, empty
 * arrays at any depth contribute no values, and successive calls do not
 * share state.
 *
 * @param {NestedIntegerArray} arr An arbitrarily nested array of integers.
 * @returns {number[]} A new array of the integers from `arr`, in encounter order.
 * @throws {TypeError} If `arr` is not an array ("Input must be an array").
 * @throws {TypeError} If a nested value is neither an integer nor an array
 * ("Array must contain only integers or nested arrays").
 * @example
 * flattenArray([[1, 2, [3]], 4]);
 * // => [1, 2, 3, 4]
 */
function flattenArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError("Input must be an array");
  }

  const result = [];

  function helper(element) {
    for (const item of element) {
      if (Array.isArray(item)) {
        helper(item);
      } else if (Number.isInteger(item)) {
        result.push(item);
      } else {
        throw new TypeError(
          "Array must contain only integers or nested arrays"
        );
      }
    }
  }

  helper(arr);
  return result;
}

module.exports = flattenArray;

/**
 * Interactive CLI Mode
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
      } finally {
        rl.close();
      }
    }
  );
}