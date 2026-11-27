const { spawnSync } = require("child_process");
const path = require("path");
const { inspect } = require("util");

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

  test("flattens JSON with no trailing newline", () => {
    const result = runCli("[[1,2,[3]],4]");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Flattened Result: [ 1, 2, 3, 4 ]");
    expect(result.stderr).toBe("");
  });

  test("flattens a pretty-printed JSON document", () => {
    const result = runCli("[\n  [1, 2],\n  [3]\n]\n");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Flattened Result: [ 1, 2, 3 ]");
    expect(result.stderr).toBe("");
  });

  test.each([
    ["empty", ""],
    ["whitespace", "   "],
    ["invalid JSON", "not-json"],
  ])("exits 1 when piped stdin is %s and has no newline", (_label, input) => {
    const result = runCli(input);

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/^Error: /);
    expect(result.stdout).not.toContain("Flattened Result:");
  });

  test("exits 1 when extra text follows the JSON value", () => {
    const result = runCli("[1,[2]]\nextra\n");

    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/^Error: /);
    expect(result.stdout).not.toContain("Flattened Result:");
  });

  test("prints every element past the default inspect limit", () => {
    const values = Array.from({ length: 101 }, (_, index) => index);
    const result = runCli(
      `${JSON.stringify(values.map((value) => [value]))}\n`
    );
    const expected = inspect(values, {
      maxArrayLength: Infinity,
      colors: false,
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain(`Flattened Result: ${expected}`);
    expect(result.stdout).not.toContain("more items");
  });
});

// The interactive branch runs only when stdin is a TTY. python3 allocates
// the pty; GitHub-hosted Ubuntu images provide it, and CI runs there.
function runCliTTY(input, term = "xterm") {
  const helper = `
import os, pty, select, sys, time
term, node, script = sys.argv[1:]
os.environ["TERM"] = term
payload = sys.stdin.buffer.read()
pid, fd = pty.fork()
if pid == 0:
    os.execv(node, [node, script])
buf = bytearray()

def pump(until_prompt):
    deadline = time.time() + 2
    while time.time() < deadline:
        ready, _, _ = select.select([fd], [], [], 0.1)
        if ready:
            try:
                chunk = os.read(fd, 4096)
            except OSError:
                chunk = b""
            if not chunk:
                break
            buf.extend(chunk)
            if until_prompt and b"): " in buf:
                return None
        wpid, status = os.waitpid(pid, os.WNOHANG)
        if wpid:
            return os.waitstatus_to_exitcode(status)
    wpid, status = os.waitpid(pid, os.WNOHANG)
    if wpid:
        return os.waitstatus_to_exitcode(status)
    return None

status = pump(True)
if status is None and payload:
    os.write(fd, payload)
    status = pump(False)
if status is None:
    os.kill(pid, 9)
    _, status = os.waitpid(pid, 0)
    status = os.waitstatus_to_exitcode(status)
sys.stdout.buffer.write(buf)
raise SystemExit(status)
`;

  const result = spawnSync(
    "python3",
    ["-c", helper, term, process.execPath, script],
    { input: Buffer.from(input), timeout: 8000 }
  );
  const output = Buffer.isBuffer(result.stdout)
    ? result.stdout.toString("utf8")
    : "";
  const cleaned = output
    .replace(/\u001b\[[0-9;]*[A-Za-z]/g, "")
    .replace(/\r/g, "");

  return {
    status: result.status,
    output: cleaned,
    harnessError: Buffer.isBuffer(result.stderr)
      ? result.stderr.toString("utf8")
      : "",
  };
}

describe("terminal prompt", () => {
  test("flattens a line submitted with Enter", () => {
    const result = runCliTTY("[[1,2,[3]],4]\n");

    expect(result.harnessError).toBe("");
    expect(result.status).toBe(0);
    expect(result.output).toContain("Flattened Result: [ 1, 2, 3, 4 ]");
  });

  test("exits 1 when Ctrl+D closes an empty prompt", () => {
    const result = runCliTTY("\u0004");

    expect(result.harnessError).toBe("");
    expect(result.status).toBe(1);
    expect(result.output).toMatch(/Error: /);
    expect(result.output).not.toContain("Flattened Result:");
  });

  test("exits 130 when Ctrl+C cancels the prompt", () => {
    const result = runCliTTY("\u0003");

    expect(result.harnessError).toBe("");
    expect(result.status).toBe(130);
    expect(result.output).not.toContain("Flattened Result:");
    expect(result.output).not.toMatch(/Error: /);
  });

  test("does not flatten text already typed when Ctrl+C cancels", () => {
    const result = runCliTTY("[[1,2]]\u0003");

    expect(result.harnessError).toBe("");
    expect(result.status).toBe(130);
    expect(result.output).not.toContain("Flattened Result:");
  });

  test("parses text already typed when a dumb terminal closes", () => {
    const result = runCliTTY("[[1,2]]\u0004", "dumb");

    expect(result.harnessError).toBe("");
    expect(result.status).toBe(0);
    expect(result.output).toContain("Flattened Result: [ 1, 2 ]");
  });
});
