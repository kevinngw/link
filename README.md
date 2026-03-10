# 🚇 Link Pulse

Realtime PWA for Seattle Link light rail, tracking live train positions on the `1 Line` and `2 Line`.

[🌐 Live Site](https://kevinngw.github.io/link/) &nbsp;|&nbsp; [中文说明](./README.zh-CN.md)

## ✨ Features

- **Live train positions** — adaptive refresh via Puget Sound OneBusAway API, with slower polling on the public `TEST` key
- **LED-style line diagram** — black-background neon display with animated train indicators
- **Three views** — `Map`, `Trains`, and `Times` tabs
- **Times board** — line-wide northbound/southbound upcoming arrivals with countdown + clock time
- **Station arrivals dialog** — click any station to see the next 4 trains in each direction
- **Shared-station merge** — stations served by both lines show unified arrival lists
- **Service status badges** — `OK`, `DELAY` (≥ 2 min late), `ARR` (approaching)
- **PWA support** — installable on desktop and mobile

## 🛠 Stack

- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- Vanilla JavaScript, SVG rendering
- Monospace UI (SF Mono / Roboto Mono / IBM Plex Mono)

## 📡 Data Sources

| Source | Endpoint |
|--------|----------|
| Realtime vehicles | Puget Sound OneBusAway `vehicles-for-agency/40.json` |
| Stop arrivals | `arrivals-and-departures-for-stop/{stopId}.json` |
| Static rail network | Sound Transit GTFS rail feed, processed by [`scripts/build-link-data.mjs`](./scripts/build-link-data.mjs) |

> **Note:** The app uses the public `TEST` API key by default. When that key is in use, vehicle polling, station auto-refresh, and arrival caching all slow down automatically, and OBA requests honor a shared cooldown with jittered exponential backoff after rate limiting. For production use, replace `TEST` with your own [OBA API key](https://developer.onebusaway.org/).

## 🚀 Development

**Requirements:** Node.js 18+, npm 9+

```bash
# Install dependencies and start dev server
npm install
npm run dev
```

The `predev` script automatically fetches the latest Sound Transit GTFS data and regenerates `public/link-data.json`.

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Layout

```
public/
  icon.svg              PWA icon
  link-data.json        Generated static rail network data
scripts/
  build-link-data.mjs   GTFS processor — fetches and transforms Sound Transit data
src/
  main.js               Application logic (~800 lines)
  style.css             Styles (~620 lines)
.github/workflows/
  deploy.yml            GitHub Pages CI/CD
index.html
vite.config.js
```

## ⚙️ Deployment

Configured for GitHub Pages via [`deploy.yml`](./.github/workflows/deploy.yml). Pushes to any tracked branch automatically build and deploy to a corresponding subdirectory on the `gh-pages` branch.

| Branch | URL |
|--------|-----|
| `main` | https://kevinngw.github.io/link/ |
| `dev` | https://kevinngw.github.io/link/dev/ |

Each branch sets `VITE_BASE` to its own subpath before building, so assets and PWA manifest resolve correctly.
