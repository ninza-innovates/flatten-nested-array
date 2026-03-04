/**
 * Flattens an arbitrarily nested array of integers.
 *
 * @param {Array<number | Array>} arr
 * @returns {number[]}
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