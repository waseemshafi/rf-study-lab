# RF & Comms Study Lab

An interactive, installable study app for RF, DSP and communications engineering. 32 topics — each with deep explanations, prerequisites, clickable derivations, **interactive computed figures**, flashcards, MCQs, worked numericals, and **runnable MATLAB + Python** code. Tracks your weak areas and suggests what to study next.

It is a **Progressive Web App (PWA)**: pure static files, works offline once loaded, and installs to the home screen on iPhone, iPad and Android like a native app.

## Topics
Communication basics, noise, PSD, noise floor, noise figure, phase noise · BPSK, differential BPSK, matched filter, EVM · PLL, FLL, Costas loop · DSSS, frequency hopping, PN codes, Gold codes, FEC, Viterbi decoder · SDR, ADC, DAC, AD9361, RFSoC · RSSI, path loss, link budget · antennas (fundamentals, gain, beamwidth, types), Maxwell's equations.

## Run locally
It's just static files — any static server works:

```bash
python -m http.server 8123
# then open http://localhost:8123
```

(Opening `index.html` directly via `file://` mostly works, but the service worker / offline install only activate over http(s).)

## Deploy to the web (GitHub Pages)
1. Create a new repository on GitHub and push this folder:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` / `/ (root)`, Save.
3. Your app appears at `https://<you>.github.io/<repo>/` in a minute or two.

All paths are **relative**, so it works whether it's served from the domain root or a `/<repo>/` subpath.

## Install on your phone / tablet
- **iPhone / iPad (Safari):** open the site → Share → **Add to Home Screen**.
- **Android (Chrome):** open the site → menu **⋮** → **Install app** / **Add to Home screen**.

It then launches full-screen, works offline, and keeps your progress locally on that device.

## Updating content
- `content.js` — categories + canonical topic order.
- `topics/*.js` — one file per category; each pushes topic objects into `CONTENT.topics`.
- `figures.js` — the interactive figure engine (`FIG`) and the topic→figure map.
- `code/*.js` — MATLAB/Python snippets per topic (`CONTENT_CODE`).
- `app.js` / `styles.css` — the UI engine and styling.

After editing any cached file, bump the `CACHE` version string in `sw.js` so installed clients pull the update.

## Notes
- MathJax is **bundled locally** (`vendor/mathjax/tex-svg.js`) so equations render with no internet.
- Progress is stored in `localStorage` per device (no account, no server).
