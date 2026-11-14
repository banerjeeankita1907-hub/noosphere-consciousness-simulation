# Noosphere — Neural-Field Visualizer and Oscillator Experiments

Noosphere contains two distinct demonstrations:

1. **Interactive visualizer** — a browser Canvas animation with randomly
   initialized neuron-like nodes, stochastic connections, cursor stimulation,
   particle motion, fractal overlays and generated audio.
2. **Kuramoto experiment** — a separate deterministic numerical model of
   globally coupled phase oscillators, with a reproducible seed, a time series
   of the Kuramoto order parameter and automated tests.

The visualizer is an artistic stochastic network animation. It does **not**
simulate consciousness, cognition or quantum mechanics. Its intensity score
increases according to elapsed time and user interaction; the active/inactive
fractions are simple firing-state counts.

## Interactive visualizer

Open [NOOSPHERE.html](NOOSPHERE.html) in a modern browser. Click to stimulate
nearby nodes, move the pointer to interact with the field, and allow the
particle and audio animations to evolve.

The UI reports:
- Node and connection counts.
- Active fraction (fraction of nodes currently marked as firing).
- Inactive fraction (one minus the active fraction).
- A simulation-intensity index controlled by elapsed time and interaction.

The particle field uses randomized visual states. It is not a physical model of
quantum superposition, entanglement or measurement.

## Reproducible Kuramoto experiment

The research module implements

```text
d(theta_i)/dt = omega_i + K/N * sum_j sin(theta_j - theta_i)
```

where theta_i is oscillator phase, omega_i is its natural frequency and K is
global coupling strength. The reported order parameter

```text
R = |(1/N) * sum_j exp(i * theta_j)|
```

summarizes phase alignment from 0 (dispersed phases) to 1 (aligned phases).
It is a metric of oscillator synchronization only, not a neural or
consciousness measure.

Run the default experiment:

```bash
npm test
npm run kuramoto -- --count 80 --coupling 5 --frequencySpread 0.12 --duration 15 --dt 0.02 --seed 2026 --output results/kuramoto.json
```

The JSON output includes the parameters, deterministic seed, sampled order
parameter trace, final phases and natural frequencies.

## Project structure

```text
NOOSPHERE.html
research/
  kuramoto.cjs          # deterministic coupled-oscillator model
  run-kuramoto.cjs      # CLI experiment runner
tests/
  kuramoto.test.cjs
  visualizer.test.cjs
.github/workflows/
  ci.yml
```

## Validation

Node.js 18 or newer:

```bash
npm test
node --check research/kuramoto.cjs
node --check research/run-kuramoto.cjs
```

GitHub Actions runs the numerical and static integrity tests on pushes and
pull requests.

## Scientific scope

The Kuramoto module is a standard phenomenological phase-oscillator model. It
is not a validated model of biological neural networks, cognition or
consciousness. The browser visualizer is a separate artistic animation and
does not use the Kuramoto solver. Any future coupling between the two should
be described and tested explicitly rather than implied by the project title.

The simulation tests check deterministic reproducibility, numerical bounds
and basic coupling behaviour. They do not establish neuroscience findings or
support claims about consciousness.
