"use strict";

function validateConfig(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new TypeError("Configuration must be an object");
  }
  const count = config.count ?? 64;
  const coupling = config.coupling ?? 2.5;
  const frequencySpread = config.frequencySpread ?? 0.15;
  const duration = config.duration ?? 20;
  const dt = config.dt ?? 0.02;
  const seed = config.seed ?? 2026;
  const sampleEvery = config.sampleEvery ?? 10;

  if (!Number.isInteger(count) || count < 3 || count > 5000) {
    throw new RangeError("count must be an integer between 3 and 5000");
  }
  if (!Number.isFinite(coupling) || coupling < 0 || coupling > 100) {
    throw new RangeError("coupling must be between 0 and 100");
  }
  if (!Number.isFinite(frequencySpread) || frequencySpread < 0 || frequencySpread > 10) {
    throw new RangeError("frequencySpread must be between 0 and 10");
  }
  if (!Number.isFinite(duration) || duration <= 0 || duration > 120) {
    throw new RangeError("duration must be greater than 0 and at most 120 seconds");
  }
  if (!Number.isFinite(dt) || dt <= 0 || dt > 0.1) {
    throw new RangeError("dt must be greater than 0 and at most 0.1 seconds");
  }
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
    throw new RangeError("seed must be an unsigned 32-bit integer");
  }
  if (!Number.isInteger(sampleEvery) || sampleEvery < 1 || sampleEvery > 10000) {
    throw new RangeError("sampleEvery must be an integer between 1 and 10000");
  }
  return { count, coupling, frequencySpread, duration, dt, seed, sampleEvery };
}

function createRandom(seed) {
  let state = seed >>> 0;
  if (state === 0) state = 0x6d2b79f5;
  return function random() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function orderParameter(phases) {
  let cosine = 0;
  let sine = 0;
  for (const phase of phases) {
    cosine += Math.cos(phase);
    sine += Math.sin(phase);
  }
  cosine /= phases.length;
  sine /= phases.length;
  return Math.sqrt(cosine * cosine + sine * sine);
}

function wrapPhase(value) {
  const twoPi = 2 * Math.PI;
  return ((value + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
}

/**
 * Simulate the Kuramoto model with fixed-step Euler integration:
 * d(theta_i)/dt = omega_i + K * mean_j sin(theta_j - theta_i).
 *
 * The returned order parameter R describes phase synchrony only. It is not
 * a neural coherence or consciousness measure.
 */
function simulateKuramoto(input = {}) {
  const config = validateConfig(input);
  const random = createRandom(config.seed);
  const phases = Array.from({ length: config.count }, () => random() * 2 * Math.PI - Math.PI);
  const naturalFrequencies = Array.from(
    { length: config.count },
    () => 1 + (random() - 0.5) * 2 * config.frequencySpread,
  );

  const steps = Math.ceil(config.duration / config.dt);
  const trace = [];
  let time = 0;

  function sample(step) {
    trace.push({
      time: Number((step * config.dt).toFixed(10)),
      orderParameter: orderParameter(phases),
    });
  }

  sample(0);
  for (let step = 1; step <= steps; step += 1) {
    let meanCosine = 0;
    let meanSine = 0;
    for (let i = 0; i < config.count; i += 1) {
      meanCosine += Math.cos(phases[i]);
      meanSine += Math.sin(phases[i]);
    }
    meanCosine /= config.count;
    meanSine /= config.count;

    const nextPhases = new Array(config.count);
    const stepDt = Math.min(config.dt, config.duration - time);
    for (let i = 0; i < config.count; i += 1) {
      const couplingTerm = meanSine * Math.cos(phases[i]) - meanCosine * Math.sin(phases[i]);
      const derivative = naturalFrequencies[i] + config.coupling * couplingTerm;
      nextPhases[i] = wrapPhase(phases[i] + stepDt * derivative);
    }
    for (let i = 0; i < config.count; i += 1) phases[i] = nextPhases[i];

    time += stepDt;
    if (step % config.sampleEvery === 0 || step === steps) {
      const last = trace[trace.length - 1];
      trace.push({
        time: Number(time.toFixed(10)),
        orderParameter: orderParameter(phases),
      });
    }
  }

  return {
    model: "Kuramoto all-to-all coupled phase oscillators",
    parameters: config,
    trace,
    initialOrderParameter: trace[0].orderParameter,
    finalOrderParameter: orderParameter(phases),
    finalPhases: phases.slice(),
    naturalFrequencies: naturalFrequencies.slice(),
    interpretation: "Order parameter R measures phase alignment in this oscillator model only; it is not a measure of consciousness, cognition or neural function.",
  };
}

module.exports = { simulateKuramoto, orderParameter };
