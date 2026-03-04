/**
 * Flattens an arbitrarily nested array of integers.
 *
 * @param {Array<number | Array>} arr - Nested array of integers
 * @returns {number[]} A flat array of integers
 * @throws {TypeError} If input is invalid
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

// Allow manual run with `npm start`
if (require.main === module) {
  const example = [[1, 2, [3]], 4];
  console.log(flattenArray(example));
}