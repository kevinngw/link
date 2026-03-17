<!-- Generated: 2026-03-16 | Files scanned: 25 | Token estimate: ~300 -->

# Dependencies

## External APIs

| Service | Usage | Client |
|---------|-------|--------|
| OneBusAway (Puget Sound) | Realtime arrivals, vehicle positions, GTFS data | `oba.js` |

**Base URL:** `https://api.pugetsound.onebusaway.org/api/where`
**Auth:** API key via `VITE_OBA_KEY` env var (falls back to 'TEST')

## Runtime Dependencies

| Package | Purpose |
|---------|---------|
| `vite-plugin-pwa` | Service worker generation, PWA manifest |

## Build Dependencies

| Package | Purpose |
|---------|---------|
| `vite` (^7.3.1) | Dev server, production bundler |
| `vitest` (^4.1.0) | Unit testing |
| `@vitest/ui` (^4.1.0) | Test UI dashboard |
| `jsdom` (^29.0.0) | DOM environment for tests |

## Build-Script Dependencies

| Package | Purpose |
|---------|---------|
| `adm-zip` | Extract GTFS ZIP files |
| `csv-parse` | Parse GTFS CSV data |

## Infrastructure

| Service | Purpose |
|---------|---------|
| GitHub Pages | Static hosting (via `deploy.yml`) |
| Vite PWA / Workbox | Offline caching, service worker |

## No Framework Dependencies

The app uses **vanilla JavaScript** with no UI framework.
All DOM manipulation is direct. No React, Vue, or similar.
