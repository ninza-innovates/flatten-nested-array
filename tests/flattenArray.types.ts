import flattenArray = require("../src/flattenArray.js");

const input: flattenArray.NestedIntegerArray = [[1, [2]], 3];

const omitted: number[] = flattenArray(input);
const explicitUndefined: number[] = flattenArray(input, undefined);

function forwardOptionalDepth(
  arr: flattenArray.NestedIntegerArray,
  depth?: number
): Array<number | flattenArray.NestedIntegerArray> {
  return flattenArray(arr, depth);
}

const forwarded: Array<number | flattenArray.NestedIntegerArray> =
  forwardOptionalDepth(input, undefined);

const limited: Array<number | flattenArray.NestedIntegerArray> = flattenArray(
  input,
  1
);

// @ts-expect-error A numeric depth can leave nested arrays, so the result is not number[].
const notOnlyNumbers: number[] = flattenArray(input, 1);

// @ts-expect-error Depth is a number, not a string.
flattenArray(input, "1");

// @ts-expect-error null is not a depth.
flattenArray(input, null);

// @ts-expect-error The input must be an array of integers.
flattenArray("nope");
