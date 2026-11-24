const { spawnSync } = require("child_process");
const path = require("path");

const script = path.join(__dirname, "..", "src", "flattenArray.js");

function runCli(input) {
  return spawnSync(process.execPath, [script], {
    input,
    encoding: "utf8",
  });
}

describe("interactive CLI", () => {
  test("prints the flattened array for valid JSON", () => {
    const result = runCli("[[1,2,[3]],4]\n");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "Enter a nested array (example: [[1,2,[3]],4]): "
    );
    expect(result.stdout).toContain("Flattened Result: [ 1, 2, 3, 4 ]");
    expect(result.stderr).toBe("");
  });

  test("reports invalid JSON on stderr and exits 1", () => {
    const result = runCli("not-json\n");

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/^Error: /);
    expect(result.stderr).toMatch(/JSON/);
    expect(result.stdout).not.toContain("Flattened Result:");
  });

  test("reports a non-array JSON value and exits 1", () => {
    const result = runCli("42\n");

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Error: Input must be an array\n");
    expect(result.stdout).not.toContain("Flattened Result:");
  });

  test("reports nested non-integers and exits 1", () => {
    const result = runCli("[1,[2.5]]\n");

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Error: Array must contain only integers or nested arrays\n"
    );
    expect(result.stdout).not.toContain("Flattened Result:");
  });

  test("exits 0 for an empty array", () => {
    const result = runCli("[]\n");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Flattened Result: []");
    expect(result.stderr).toBe("");
  });
});
