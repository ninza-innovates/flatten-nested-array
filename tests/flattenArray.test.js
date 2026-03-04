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

  test("handles single element", () => {
    expect(flattenArray([5])).toEqual([5]);
  });

  test("throws error for invalid input type", () => {
    expect(() => flattenArray("not an array")).toThrow(TypeError);
  });

  test("throws error for non-integer values", () => {
    expect(() => flattenArray([1, 2, "3"])).toThrow(TypeError);
  });
});