/**
 * Flattens every level of a nested array of integers.
 *
 * Same contract as calling the form below with `depth` left at its default,
 * `Infinity`. The result contains only integers.
 *
 * @param arr - An arbitrarily nested array of integers. Each visited leaf
 *   must pass `Number.isInteger`.
 * @returns A new array of the integers from `arr`, in encounter order.
 * @example
 * flattenArray([[1, 2, [3]], 4]);
 * // => [1, 2, 3, 4]
 * @example
 * flattenArray([1, [], [2, [[-3]]]]);
 * // => [1, 2, -3]
 */
declare function flattenArray(arr: flattenArray.NestedIntegerArray): number[];

/**
 * Flattens every level when `undefined` is passed for `depth`.
 *
 * The runtime default parameter treats `undefined` the same as omitting
 * `depth`. The result contains only integers.
 *
 * @param arr - An arbitrarily nested array of integers. Each visited leaf
 *   must pass `Number.isInteger`.
 * @param depth - `undefined`, which selects the default of `Infinity`.
 * @returns A new array of the integers from `arr`, in encounter order.
 */
declare function flattenArray(
  arr: flattenArray.NestedIntegerArray,
  depth: undefined
): number[];

/**
 * Flattens up to `depth` levels of a nested array of integers.
 *
 * Integers are collected from left to right. The input is not mutated, and
 * successive calls do not share state. `depth` must be a non-negative integer
 * or `Infinity`. A nested array past that limit is the original array and is
 * not validated further. Nesting is walked with an explicit stack, so nesting
 * is not limited by the call stack.
 *
 * A value of type `number | undefined`, such as an optional parameter
 * forwarded by a wrapper, uses this signature. The result may still contain
 * nested arrays, because the value might be a number. Pass `undefined`
 * itself, or omit `depth`, when the result must be typed as `number[]`.
 *
 * @param arr - An arbitrarily nested array of integers. The runtime value
 *   must be a real array (array-like objects are rejected). Each visited leaf
 *   must pass `Number.isInteger`, so values such as `1.5`, `NaN`, `Infinity`,
 *   bigints, and strings throw when they are visited. TypeScript has no
 *   integer type, so leaves are declared as `number`.
 * @param depth - How many levels of nesting to flatten. `0` copies the top
 *   level only. Omit it, or pass `undefined`, to flatten every level.
 * @returns A new array. Nested arrays remain where `depth` stops the walk.
 * @throws {TypeError} If `arr` is not an array (`"Input must be an array"`).
 * @throws {TypeError} If `depth` is not a non-negative integer or `Infinity`
 * (`"Depth must be a non-negative integer or Infinity"`).
 * @throws {TypeError} If a visited value is neither an integer nor an array
 * (`"Array must contain only integers or nested arrays"`).
 * @throws {TypeError} If an entered array refers back to itself through the
 * current path (`"Array must not contain circular references"`). The same
 * nested array may still appear in more than one place. A cycle past
 * `depth` is left in place.
 * @example
 * flattenArray([1, [2, [3]]], 1);
 * // => [1, 2, [3]]
 */
declare function flattenArray(
  arr: flattenArray.NestedIntegerArray,
  depth?: number
): Array<number | flattenArray.NestedIntegerArray>;

declare namespace flattenArray {
  /**
   * An arbitrarily nested array whose leaves are integers.
   *
   * Arrays may be empty and may nest to any depth. At runtime every visited
   * leaf must pass `Number.isInteger`.
   */
  export type NestedIntegerArray = ReadonlyArray<number | NestedIntegerArray>;
}

export = flattenArray;
