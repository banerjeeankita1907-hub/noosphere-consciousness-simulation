const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "..", "NOOSPHERE.html"), "utf8");

test("visualizer inline JavaScript parses without execution", () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]));
});

test("display labels describe simulation activity rather than consciousness", () => {
  assert.match(html, /SIMULATION INTENSITY/);
  assert.match(html, /ACTIVE FRACTION/);
  assert.match(html, /INACTIVE FRACTION/);
  assert.doesNotMatch(html, /CONSCIOUSNESS LEVEL|EMERGENT CONSCIOUSNESS|SENTIENT/i);
});

test("HTML element IDs are unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.ok(ids.length > 0);
  assert.equal(new Set(ids).size, ids.length);
});
