# MosquitoHK Scenario Explorer

A bilingual (English / Traditional Chinese) static prototype for exploring Hong Kong mosquito relative abundance across space and time.

**GitHub Pages demo:** https://hanzhichen02.github.io/mosquitohk-scenario-explorer/

The interface includes intervention settings, a robustness panel, a Hong Kong 1 km grid map, and a linked time-series chart. Moving over the chart updates the map date. The geographic grid and no-intervention baseline are based on MosquitoHK preliminary results supplied by the project team. Changes produced by the controls are illustrative browser-side rules. They are **not** predictions from a fitted three-stage model, observed AGI, or estimates of policy effectiveness.

This repository contains the full static front end: `index.html`, stylesheets, `app.js`, and `baseline-2025.json`. There is no backend or build step. To run it locally, serve this directory with a static HTTP server, for example:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`.
