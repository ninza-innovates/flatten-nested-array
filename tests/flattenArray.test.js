const flattenArray = require("../src/flattenArray");

describe("flattenArray", () => {
  test("flattens nested arrays", () => {
    expect(flattenArray([[1, 2, [3]], 4])).toEqual([1, 2, 3, 4]);
  });

  test("handles deeply nested arrays", () => {
    expect(flattenArray([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
  });

  test("handles empty array", () => {
    expect(flattenArray([])).toEqual([]);
  });

  test("handles negative integers", () => {
    expect(flattenArray([[1, -2, [3]]])).toEqual([1, -2, 3]);
  });

  test("throws error for invalid input type", () => {
    expect(() => flattenArray("not an array")).toThrow(TypeError);
  });

  test("throws error for non-integer values", () => {
    expect(() => flattenArray([1, 2, "3"])).toThrow(TypeError);
  });
});

describe("empty arrays beyond a single empty root", () => {
  test("flattens nested empty arrays to an empty array", () => {
    expect(flattenArray([[]])).toEqual([]);
    expect(flattenArray([[], [[]]])).toEqual([]);
    expect(flattenArray([[[]]])).toEqual([]);
  });

  test("skips empty arrays placed among integers", () => {
    expect(flattenArray([1, [], [2, [[]]], 3])).toEqual([1, 2, 3]);
    expect(flattenArray([[], 0, [], [-4]])).toEqual([0, -4]);
  });
});

describe("deep and irregular nesting", () => {
  test("flattens a chain deeper than the four-level case", () => {
    expect(flattenArray([1, [2, [3, [4, [5]]]]])).toEqual([1, 2, 3, 4, 5]);
  });

  test("flattens sibling branches that nest to different depths", () => {
    expect(flattenArray([[1, [2, 3]], [4, [5, [6]]], 7])).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });
});

describe("supported non-array values", () => {
  test("keeps a flat list of integers, including zero and safe bounds", () => {
    expect(
      flattenArray([0, Number.MIN_SAFE_INTEGER, 42, Number.MAX_SAFE_INTEGER])
    ).toEqual([0, Number.MIN_SAFE_INTEGER, 42, Number.MAX_SAFE_INTEGER]);
  });

  test("keeps zero and negative integers inside nested arrays", () => {
    expect(flattenArray([0])).toEqual([0]);
    expect(flattenArray([[-1, 0, [-3]], 4])).toEqual([-1, 0, -3, 4]);
  });

  test("preserves left-to-right order without mutating the input", () => {
    const input = [8, [6, [7]], 5];
    const result = flattenArray(input);

    expect(result).toEqual([8, 6, 7, 5]);
    expect(result).not.toBe(input);
    expect(input).toEqual([8, [6, [7]], 5]);
  });

  test("does not leak values between calls", () => {
    expect(flattenArray([1, [2]])).toEqual([1, 2]);
    expect(flattenArray([3, [4]])).toEqual([3, 4]);
  });
});

describe("values outside the integer contract", () => {
  test.each([
    ["null", null],
    ["undefined", undefined],
    ["a number", 4],
    ["a plain object", { 0: 1, length: 1 }],
  ])("throws TypeError when the root is %s", (_label, value) => {
    expect(() => flattenArray(value)).toThrow(
      new TypeError("Input must be an array")
    );
  });

  test.each([
    ["a fractional number", 1.5],
    ["NaN", NaN],
    ["Infinity", Infinity],
    ["negative Infinity", -Infinity],
    ["null", null],
    ["undefined", undefined],
    ["a boolean", false],
    ["a numeric string", "1"],
    ["a bigint", 1n],
    ["a boxed number", Object(1)],
  ])("throws TypeError when a nested value is %s", (_label, value) => {
    expect(() => flattenArray([0, [value]])).toThrow(
      new TypeError("Array must contain only integers or nested arrays")
    );
  });
});