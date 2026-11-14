const test = require("node:test");
const assert = require("node:assert/strict");
const { orderParameter, simulateKuramoto } = require("../research/kuramoto.cjs");

test("order parameter is bounded and equals one for identical phases", () => {
  assert.ok(orderParameter([0, 1, 2]) >= 0);
  assert.ok(orderParameter([0, 1, 2]) <= 1);
  assert.equal(orderParameter([0, 0, 0, 0]), 1);
});

test("fixed seed and parameters produce byte-for-byte deterministic outputs", () => {
  const config = { count: 48, seed: 1234, coupling: 2.8, duration: 4, dt: 0.02 };
  const first = simulateKuramoto(config);
  const second = simulateKuramoto(config);
  assert.deepEqual(first, second);
});

test("stronger coupling increases synchrony in a narrow-frequency ensemble", () => {
  const base = { count: 80, seed: 2026, frequencySpread: 0.12, duration: 15, dt: 0.02 };
  const weak = simulateKuramoto({ ...base, coupling: 0 });
  const strong = simulateKuramoto({ ...base, coupling: 5 });
  assert.ok(strong.finalOrderParameter > weak.finalOrderParameter + 0.25);
  assert.ok(strong.finalOrderParameter > 0.85);
});

test("zero coupling preserves independent phase velocities", () => {
  const result = simulateKuramoto({
    count: 12, seed: 7, coupling: 0, frequencySpread: 0,
    duration: 1, dt: 0.01, sampleEvery: 10,
  });
  assert.equal(result.finalOrderParameter, result.initialOrderParameter);
});

test("trace contains the initial point and final simulated time", () => {
  const result = simulateKuramoto({ duration: 1, dt: 0.1, sampleEvery: 3 });
  assert.equal(result.trace[0].time, 0);
  assert.equal(result.trace[result.trace.length - 1].time, 1);
});

test("rejects invalid numerical parameters", () => {
  assert.throws(() => simulateKuramoto({ count: 2 }), /count/);
  assert.throws(() => simulateKuramoto({ coupling: -1 }), /coupling/);
  assert.throws(() => simulateKuramoto({ frequencySpread: -1 }), /frequencySpread/);
  assert.throws(() => simulateKuramoto({ dt: 0.5 }), /dt/);
  assert.throws(() => simulateKuramoto({ seed: -2 }), /seed/);
});
