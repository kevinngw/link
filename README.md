# Link Pulse

Realtime PWA for Seattle Link light rail, focused on `1 Line` and `2 Line`.

[Live site](https://kevinngw.github.io/link/)  
[中文说明 / Chinese README](./README.zh-CN.md)

## Features

- Live train positions for `1 Line` and `2 Line`
- Black LED-style line diagram
- `Map`, `Trains`, and `Times` tabs
- Station dialog with live arrivals
- Shared-station arrival merge for segments served by both lines
- PWA support for desktop and mobile install

## Stack

- [Vite](https://vitejs.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- Vanilla JavaScript
- SVG rendering

## Data Sources

- Realtime vehicles: Puget Sound OneBusAway `vehicles-for-agency/40.json`
- Stop arrivals: `arrivals-and-departures-for-stop/{stopId}.json`
- Static rail network: Sound Transit GTFS rail feed, processed by [`scripts/build-link-data.mjs`](/Users/kevinwu/Workspaces/link/scripts/build-link-data.mjs)

Notes:

- The app uses the public `TEST` API key by default.
- Client requests include backoff retry when the OneBusAway test key is rate-limited.
- For production use, replace `TEST` with your own OBA key.

## Development

Requirements:

- Node.js 18+
- npm 9+

Install and run:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Layout

```text
public/
  icon.svg
  link-data.json
scripts/
  build-link-data.mjs
src/
  main.js
  style.css
.github/workflows/
  deploy.yml
vite.config.js
```

## Deployment

This repository is configured for GitHub Pages through [deploy.yml](/Users/kevinwu/Workspaces/link/.github/workflows/deploy.yml).

Any push to `main` triggers:

1. `npm ci`
2. `npm run build`
3. GitHub Pages deploy from `dist/`
