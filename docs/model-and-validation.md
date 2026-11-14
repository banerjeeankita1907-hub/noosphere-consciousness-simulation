# Model definitions, reproducibility and interpretation

## 1. Interactive visualizer

The browser visualizer initializes a stochastic collection of point-like
nodes and directed connections. Nodes have a refractory timer, local activity
variable and randomized outgoing links. Signals move across links and can
trigger a target node when its threshold is crossed. Mouse movement stimulates
nearby nodes; clicks create a local burst. A separate particle layer and
procedural audio provide visual and sound feedback.

The displayed simulation-intensity index is an animation parameter. It
increases with elapsed time and pointer interaction. The active fraction is
the number of nodes currently marked as firing divided by the total node
count. The inactive fraction is defined as one minus the active fraction.

These measures are not entropy, information integration, neural coherence,
consciousness or cognitive performance. The particle field uses visual state
transitions and pair links, not quantum states or physical entanglement.

## 2. Kuramoto coupled-oscillator experiment

The independent research module uses the all-to-all Kuramoto model:

    dθᵢ/dt = ωᵢ + (K/N) Σⱼ sin(θⱼ − θᵢ)

Natural frequencies are drawn from a uniform interval centered at 1 with
half-width frequencySpread. Initial phases are drawn uniformly from
[-π, π). A xorshift32 generator is initialized from the user-provided 32-bit
seed, so a fixed parameter set yields a repeatable run.

The coupling term is calculated using the population mean sine and cosine,
which is algebraically equivalent to the all-to-all summation and reduces each
time step to O(N) work.

Fixed-step explicit Euler integration is used. The final integration step is
shortened when the duration is not an exact multiple of the requested time
step. Phases are wrapped into [-π, π).

The Kuramoto order parameter is:

    R = sqrt(mean(cos θ)² + mean(sin θ)²)

R near zero indicates phase dispersion; R near one indicates alignment. It
does not measure cognition, neural function or subjective experience.

## 3. Reproducibility

Every experiment output records:
- Oscillator count.
- Coupling constant.
- Natural-frequency spread.
- Duration and time step.
- PRNG seed.
- Sampling interval.
- Initial and final order parameter.
- Sampled time series, final phase vector and natural frequencies.

A reproducible run can be invoked with:

    npm run kuramoto -- --count 80 --coupling 5 --frequencySpread 0.12 --duration 15 --dt 0.02 --seed 2026 --output results/kuramoto.json

The tests use deterministic numerical fixtures and do not depend on network
access or external datasets.

## 4. Limitations

The oscillator network assumes global coupling, identical coupling strength,
fixed natural frequencies and no spatial structure. It does not model
synaptic dynamics, excitatory/inhibitory cell populations, delays, plasticity,
sensory processing or biological noise. The explicit Euler solver is
appropriate only for the tested parameter/time-step range and should be
subjected to convergence studies for research use.

The visualizer and the Kuramoto model are separate code paths. The interactive
visualizer does not display the Kuramoto simulation results. No result in this
repository is evidence of artificial consciousness or quantum effects.
