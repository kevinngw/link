# CLAUDE.md — Link Pulse Codebase Guide

This file documents the codebase structure, conventions, and workflows for AI assistants working in this repository.

---

## Project Overview

**Link Pulse** is a vanilla JavaScript Progressive Web App (PWA) for real-time transit tracking in the Puget Sound region (Seattle). It displays live vehicle positions, arrival times, and service insights for Link light rail, RapidRide, and Swift BRT systems via the OneBusAway (OBA) API. The app is bilingual (English / Simplified Chinese) and supports offline use via a service worker.

**Tech stack:** Vanilla JS (ES modules) · Vite · vite-plugin-pwa · Vitest · No framework

---

## Repository Layout

```
link/
├── index.html                  # PWA entry point (loads src/main.js)
├── package.json                # npm scripts, deps
├── vite.config.js              # Vite + PWA plugin config
├── vitest.config.js            # Test config (JSDOM, coverage)
├── .env.example                # Template for VITE_OBA_KEY
├── public/
│   ├── pulse-data.json         # Generated transit data (gitignored, built by predev/prebuild)
│   └── icon-*.png / apple-*   # PWA icons and iOS splash screens
├── scripts/
│   └── build-link-data.mjs    # GTFS fetch-and-transform script
├── src/
│   ├── main.js                 # Orchestrator / app entry (2710 lines)
│   ├── config.js               # Constants, API keys, i18n copy, feature flags
│   ├── style.css               # All styles (3908 lines, single stylesheet)
│   ├── app-store.js            # Domain actions and computed properties
│   ├── store.js                # Proxy-based reactive state store
│   ├── static-data.js          # GTFS data loader + layout builder
│   ├── oba.js                  # OneBusAway API client
│   ├── arrivals.js             # Arrival fetching + adaptive concurrency
│   ├── vehicles.js             # Vehicle status classification
│   ├── insights.js             # Headway/delay analytics
│   ├── station-search.js       # Station search + geolocation
│   ├── favorites.js            # Saved stations management
│   ├── keyboard-nav.js         # Vim-style keyboard shortcuts
│   ├── url-state.js            # URL parameter syncing
│   ├── virtual-scroll.js       # Virtual scrolling for large lists
│   ├── error-boundary.js       # Global error handler + perf monitor
│   ├── vehicle-display.js      # Vehicle UI rendering helpers
│   ├── formatters.js           # Date/time i18n formatting
│   ├── utils.js                # Distance, slugify, shared helpers
│   ├── toast.js                # Toast notification system
│   ├── dialogs/
│   │   ├── dom.js              # Cached dialog element selectors
│   │   ├── overlays.js         # Train + alert dialog renderers
│   │   ├── station-display.js  # Marquee board display mode
│   │   └── station-render.js   # Station arrival list rendering
│   └── renderers/
│       ├── map.js              # SVG line diagram with vehicle positions
│       ├── trains.js           # Vehicle queue list view
│       └── insights.js         # Service health dashboard
├── docs/CODEMAPS/
│   ├── architecture.md         # System architecture + data flow
│   ├── frontend.md             # View hierarchy + rendering pipeline
│   ├── data.md                 # Data sources and processing
│   └── dependencies.md         # Module dependency analysis
└── .claude/
    ├── settings.local.json     # Claude permission allowlist
    └── skills/link-patterns.md # Extracted commit + coding patterns
```

---

## Development Commands

```bash
npm run dev           # Start dev server (auto-runs build-link-data.mjs first)
npm run build         # Production build (auto-runs build-link-data.mjs first)
npm run preview       # Serve the production build locally

npm test              # Run tests in watch mode
npm run test:run      # Single test run (use in CI)
npm run test:ui       # Open browser test dashboard
npm run test:coverage # Generate coverage report
```

**Environment:**
- Copy `.env.example` → `.env.local` and set `VITE_OBA_KEY` for a real OBA API key.
- The build falls back to the public `TEST` key if `VITE_OBA_KEY` is unset.
- Node.js 20.19+ or 22.12+ required; npm 10+.

---

## Architecture

### Data Flow

```
GTFS (OBA API)                          Realtime (OBA API)
     |                                        |
scripts/build-link-data.mjs         oba.js (queue + SWR cache)
     |                                        |
pulse-data.json ──> static-data.js     arrivals.js (adaptive concurrency)
                         |                    |
                    state.lines          state.arrivalsCache
                    state.layouts        state.vehiclesByLine
                         |                    |
                         └───── app-store ─────┘
                                   |
                    ┌──────────────┼──────────────┐
                    |              |              |
              renderers/      renderers/     renderers/
               map.js        trains.js      insights.js
                    |              |              |
                    └──── dialogs (station, train, alert) ────┘
                                   |
                                  DOM
```

### State Management

- `store.js` — Proxy-based reactive store with property-level subscribers (no framework).
- `app-store.js` — Domain actions (`setTab`, `setLine`, `updateVehicles`, etc.) and computed properties (`visibleLines`, `hasError`, `isLoading`).
- `main.js` — Wires everything together; orchestrates rendering on state changes.

### API Client (`oba.js`)

Key design patterns to preserve:
- **Request queue + deduplication** — concurrent requests for the same endpoint are merged.
- **Stale-while-revalidate caching** — serves cached data immediately, updates in background.
- **Adaptive concurrency** — lowers max concurrent requests when error rate rises.
- **AbortController** — cancels in-flight requests when a dialog closes.
- **Rate limit handling** — cooldown + jitter on 429 responses.

Never bypass `oba.js` to call the OBA API directly.

---

## Key Conventions

### Code Style

- **No framework** — plain DOM manipulation; avoid introducing React/Vue/etc.
- **No linter/formatter config** — follow the surrounding code style.
- **ES modules** — `import`/`export` throughout; no CommonJS.
- **Single stylesheet** — all CSS lives in `src/style.css`; use CSS custom properties for theming.
- **Mobile-first** — always test at mobile viewport widths; iOS PWA compatibility is a priority.

### i18n

All user-visible strings go in `src/config.js` under `UI_COPY`, keyed by feature area:

```js
UI_COPY: {
  myFeature: {
    label: { en: 'English text', 'zh-CN': '中文' },
  }
}
```

Retrieve with `copyValue('myFeature.label')` (defined in `main.js`). Never hardcode display strings in renderers.

### Feature Flags and Constants

All configuration constants, API keys, timing intervals, and feature flags belong in `src/config.js`. Do not scatter magic numbers through modules.

### Module Extraction Pattern

When `main.js` grows too large for a feature area:
1. Create a new module under `src/` (or `src/dialogs/`, `src/renderers/`).
2. Export focused functions from it.
3. Import and wire up in `main.js`.

Files that commonly change together:
- `main.js` + `style.css` — UI features
- `main.js` + `config.js` — constants and copy
- `main.js` + `oba.js` — API / data flow changes
- `dialogs/station-display.js` + `dialogs/station-render.js` — station dialog work

### Static Data Pipeline

`public/pulse-data.json` is **generated** (gitignored). It is built automatically by `scripts/build-link-data.mjs` before every dev/build run. Do not commit it. Do not edit it manually.

---

## Testing

- **Framework:** Vitest with JSDOM environment
- **Location:** Co-located with source — `src/*.test.js` and `src/dialogs/*.test.js`
- **Style:** `describe` / `it` blocks with descriptive names
- **Run for CI:** `npm run test:run`

When adding a new module, add a corresponding `*.test.js` file in the same directory.

---

## Commit Conventions

Use conventional commit prefixes (recent commits trend this way):

| Prefix | When to use |
|--------|-------------|
| `feat:` | New user-facing feature |
| `fix:` | Bug fix (note platform if mobile-specific) |
| `refactor:` | Code extraction / reorganization without behavior change |
| `docs:` | README or documentation updates |

---

## CI/CD

`.github/workflows/deploy.yml` deploys to GitHub Pages on push to `main` or `dev`:

| Branch | URL |
|--------|-----|
| `main` | `https://kevinngw.github.io/link/` |
| `dev` | `https://kevinngw.github.io/link/dev/` |

The workflow uses `VITE_OBA_KEY` from repository secrets (falls back to `TEST`).

---

## PWA Notes

- Service worker auto-updates via `vite-plugin-pwa` (Workbox, auto-update mode).
- `pulse-data.json` uses a NetworkFirst caching strategy.
- iOS splash screens for all device sizes are pre-generated in `public/`.
- Do not remove PWA meta tags from `index.html`.

---

## What to Avoid

- Do not introduce npm dependencies without discussion — the project is intentionally dependency-light.
- Do not add a JS framework (React, Vue, Svelte, etc.).
- Do not call the OBA API outside of `oba.js`.
- Do not hardcode user-visible strings — use `UI_COPY` in `config.js`.
- Do not commit `public/pulse-data.json`.
- Do not modify `public/` PWA icons or splash screens unless updating assets intentionally.
