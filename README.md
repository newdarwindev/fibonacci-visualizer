# Fibonacci visualizer

A small, self-contained HTML app for exploring the Fibonacci sequence. Includes a responsive linear-scale bar chart, exact sequence values, an addition breakdown, and a ratio comparison with the golden ratio.

## Open it

Download or clone this repository and open **index.html** in a modern browser. No installation, server, build step, or internet connection is needed.

- Drag the index slider (or use its arrow keys) to explore F₀ through F₂₄.
- **Next step** advances one term; **Play / Pause** controls automatic progression.
- **Reset** returns to F₀; **Replay** restarts after F₂₄.

The sequence uses F₀ = 0 and F₁ = 1. F₂₄ = 46,368. All displayed integers are exact. The chart rescales at each step; smaller values can become visually negligible, so the exact values are always listed underneath. The ratio is undefined for indices 0 and 1.

All CSS and JavaScript are inline in `index.html`. There are no external assets, network requests, analytics, or dependencies. Playback starts only on request and pauses when the page is hidden.

## Tests

With Node.js installed, run `node test.cjs`. These dependency-free tests check the sequence, chart bounds, and control logic using a minimal DOM stub. They do not substitute for real-browser visual or assistive-technology testing.
