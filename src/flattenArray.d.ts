/**
 * Flattens an arbitrarily nested array of integers into a new array.
 *
 * Integers are collected from left to right. The input is not mutated, empty
 * arrays at any depth contribute no values, and successive calls do not
 * share state.
 *
 * @param arr - An arbitrarily nested array of integers. The runtime value
 *   must be a real array (array-like objects are rejected). Each leaf must
 *   pass `Number.isInteger`, so values such as `1.5`, `NaN`, `Infinity`,
 *   bigints, and strings throw. TypeScript has no integer type, so leaves
 *   are declared as `number`.
 * @returns A new array of the integers from `arr`, in encounter order.
 * @throws {TypeError} If `arr` is not an array (`"Input must be an array"`).
 * @throws {TypeError} If a nested value is neither an integer nor an array
 * (`"Array must contain only integers or nested arrays"`).
 * @example
 * flattenArray([[1, 2, [3]], 4]);
 * // => [1, 2, 3, 4]
 * @example
 * flattenArray([1, [], [2, [[-3]]]]);
 * // => [1, 2, -3]
 */
declare function flattenArray(arr: flattenArray.NestedIntegerArray): number[];

declare namespace flattenArray {
  /**
   * An arbitrarily nested array whose leaves are integers.
   *
   * Arrays may be empty and may nest to any depth. At runtime every leaf
   * must pass `Number.isInteger`.
   */
  export type NestedIntegerArray = ReadonlyArray<number | NestedIntegerArray>;
}

export = flattenArray;
