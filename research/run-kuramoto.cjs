"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { simulateKuramoto } = require("./kuramoto.cjs");

function parseArgs(args) {
  const values = {
    count: 64,
    coupling: 2.5,
    frequencySpread: 0.15,
    duration: 20,
    dt: 0.02,
    seed: 2026,
    sampleEvery: 10,
    output: "kuramoto-results.json",
  };
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith("--")) throw new Error("Unexpected argument: " + token);
    const key = token.slice(2);
    if (!(key in values)) throw new Error("Unknown option: " + token);
    if (index + 1 >= args.length) throw new Error("Missing value for " + token);
    const value = args[++index];
    if (key === "output") values.output = value;
    else values[key] = Number(value);
  }
  return values;
}

function main(args = process.argv.slice(2)) {
  try {
    const options = parseArgs(args);
    const result = simulateKuramoto(options);
    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + "\n", "utf8");
    console.log("Wrote reproducible oscillator run to " + outputPath);
    console.log("Initial order parameter: " + result.initialOrderParameter.toFixed(4));
    console.log("Final order parameter:   " + result.finalOrderParameter.toFixed(4));
    console.log("Seed: " + result.parameters.seed);
    return 0;
  } catch (error) {
    console.error("Kuramoto experiment failed: " + error.message);
    return 1;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = { main, parseArgs };
