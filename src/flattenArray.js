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
 * `Infinity` flattens completely. Omitting `depth` or passing `undefined`
 * does that. `0` copies the top level only. A nested array past this limit
 * is the original array and is not validated further. Must be a non-negative
 * integer or `Infinity`.
 * @returns {Array<number | NestedIntegerArray>} Integers from `arr`, in
 * encounter order. Nested arrays remain only where `depth` stops the walk.
 * When `depth` is omitted or `undefined`, the array contains only integers.
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
 * In a terminal, the prompt reads one line of JSON. Ctrl+D with no line,
 * or a terminal that closes before Enter, is empty input unless text was
 * already typed; that text is parsed. Ctrl+C cancels the prompt and exits
 * 130. Piped input is read until end of file as a single JSON value, so
 * pretty-printed arrays and values with no trailing newline are accepted.
 * A successful flatten prints every element of the result and exits 0.
 * Empty input, invalid JSON, trailing non-JSON text, or a value
 * `flattenArray` rejects prints `Error:` on stderr and exits 1, so a
 * script can tell failure from success.
 */
if (require.main === module) {
  const { inspect } = require("util");

  const prompt = "Enter a nested array (example: [[1,2,[3]],4]): ";

  const finish = (answer) => {
    try {
      const parsedInput = JSON.parse(answer);
      const result = flattenArray(parsedInput);
      // Passing the array itself would stop at util.inspect's default of 100 elements.
      console.log(
        "Flattened Result:",
        inspect(result, { maxArrayLength: Infinity, colors: false })
      );
    } catch (error) {
      console.error("Error:", error.message);
      process.exitCode = 1;
    }
  };

  if (process.stdin.isTTY) {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Enter submits the line. Ctrl+C cancels. A close before Enter, such as
    // Ctrl+D or the terminal ending, parses text already typed. Settle once
    // so that close does not parse a line Enter or Ctrl+C already handled.
    let settled = false;

    rl.on("SIGINT", () => {
      if (settled) return;
      settled = true;
      process.exitCode = 130;
      process.stdout.write("\n");
      rl.close();
    });

    rl.once("close", () => {
      if (settled) return;
      settled = true;
      finish(rl.line);
    });

    rl.question(prompt, (answer) => {
      if (settled) return;
      settled = true;
      finish(answer);
      rl.close();
    });
  } else {
    const fs = require("fs");
    // Read stdin before writing so a full pipe cannot deadlock on the prompt.
    const answer = fs.readFileSync(0, "utf8");
    process.stdout.write(prompt);
    finish(answer);
  }
}
