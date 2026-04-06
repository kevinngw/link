# CLAUDE.md — Link Pulse Codebase Guide

This file documents the codebase structure, conventions, and workflows for AI assistants working in this repository.

---

## Project Overview

**Link Pulse** is a vanilla JavaScript Progressive Web App (PWA) and native iOS app for real-time transit tracking in the Puget Sound region (Seattle). It displays live vehicle positions, arrival times, and service insights for Link light rail, RapidRide, and Swift BRT systems via the OneBusAway (OBA) API. The app is bilingual (English / Simplified Chinese) and supports offline use via a service worker (web) or Capacitor (iOS).

**Tech stack:** Vanilla JS (ES modules) · Vite · vite-plugin-pwa · Capacitor (iOS) · Vitest · No framework

---

## Repository Layout

```
link/
├── index.html                  # PWA entry point (loads src/main.js)
├── package.json                # npm scripts, deps
├── vite.config.js              # Vite + PWA plugin config, dual build targets
├── vitest.config.js            # Test config (JSDOM, v8 coverage)
├── capacitor.config.json       # Capacitor iOS configuration
├── .env.example                # Template for VITE_OBA_KEY
├── public/
│   ├── pulse-data.json         # Generated transit data (gitignored)
│   └── icon-*.png / apple-*   # PWA icons and iOS splash screens
├── scripts/
│   └── build-link-data.mjs    # GTFS fetch-and-transform script
├── src/
│   ├── main.js                 # Orchestrator / app entry (2213 lines)
│   ├── config.js               # Constants, API keys, feature flags (84 lines)
│   ├── copy.js                 # All UI strings, bilingual en/zh-CN (758 lines)
│   ├── style.css               # CSS entry point (imports src/styles/*.css)
│   │
│   ├── app-shell.js            # HTML structure template
│   ├── app-dom.js              # Cached DOM element selectors
│   ├── app-store.js            # Domain actions and computed properties
│   ├── store.js                # Proxy-based reactive state store
│   ├── event-handlers.js       # App event handler registration
│   ├── dialog-lifecycle.js     # Dialog state and lifecycle management
│   │
│   ├── static-data.js          # GTFS data loader + layout builder
│   ├── oba.js                  # OneBusAway API client
│   ├── arrivals.js             # Arrival fetching + adaptive concurrency
│   ├── arrival-vehicle.js      # Vehicle resolution for arrivals
│   ├── vehicles.js             # Vehicle status classification
│   ├── insights.js             # Headway/delay analytics
│   ├── insights-metrics.js     # Insights data aggregation
│   ├── service-timeline.js     # Service time window helpers
│   │
│   ├── station-search.js       # Station search + geolocation
│   ├── favorites.js            # Saved stations management
│   ├── recent-stations.js      # Recently viewed stations tracking
│   ├── ride-mode.js            # Heads-up notification for approaching stops
│   ├── keyboard-nav.js         # Vim-style keyboard shortcuts
│   ├── url-state.js            # URL parameter syncing
│   ├── virtual-scroll.js       # Virtual scrolling for large lists
│   │
│   ├── vehicle-display.js      # Vehicle UI rendering helpers
│   ├── formatters.js           # Date/time i18n formatting
│   ├── utils.js                # Distance, slugify, shared helpers
│   ├── toast.js                # Toast notification system
│   ├── error-boundary.js       # Global error handler + perf monitor
│   │
│   ├── dialogs/
│   │   ├── dom.js              # Cached dialog element selectors
│   │   ├── overlays.js         # Train + alert dialog renderers
│   │   ├── station-display.js  # Marquee board display mode
│   │   └── station-render.js   # Station arrival list rendering
│   ├── renderers/
│   │   ├── map.js              # SVG line diagram with vehicle positions
│   │   ├── trains.js           # Vehicle queue list view
│   │   └── insights.js         # Service health dashboard
│   ├── native/                 # Capacitor native integration
│   │   ├── platform.js         # Capacitor detection + build target
│   │   ├── storage.js          # Capacitor Preferences wrapper
│   │   ├── location.js         # Geolocation helpers
│   │   ├── haptics.js          # Haptic feedback
│   │   ├── share.js            # Native share
│   │   └── splash.js           # Splash screen control
│   └── styles/                 # Modular CSS (5595 lines total)
│       ├── base.css            # Base styles and CSS custom properties
│       ├── board.css           # Board/layout styles
│       ├── trains.css          # Train list styles
│       ├── dialogs.css         # Dialog styles
│       ├── animations.css      # Animation utilities
│       ├── favorites.css       # Favorites UI styles
│       ├── share.css           # Share dialog styles
│       └── mobile.css          # Mobile responsive styles
├── docs/
│   ├── CODEMAPS/
│   │   ├── architecture.md     # System architecture + data flow
│   │   ├── frontend.md         # View hierarchy + rendering pipeline
│   │   ├── data.md             # Data sources and processing
│   │   └── dependencies.md     # Module dependency analysis
│   ├── app-store-connect-submission.md
│   └── ios-app-store-readiness.md
└── .claude/
    ├── settings.local.json     # Claude permission allowlist
    ├── launch.json             # Dev server config (port 5173)
    └── skills/link-patterns.md # Extracted commit + coding patterns
```

---

## Development Commands

```bash
# Web development
npm run dev              # Start Vite dev server
npm run dev:refresh      # Rebuild transit data + start dev server
npm run refresh:data     # Rebuild pulse-data.json only
npm run build            # Production web build (alias for build:web)
npm run build:web        # Production web build (VITE_TARGET=web)
npm run preview          # Serve the production build locally

# iOS / native
npm run build:native     # Native build (VITE_TARGET=native, skips PWA)
npm run cap:sync         # Build native + sync to iOS project
npm run ios:open         # Open Xcode project

# Testing
npm test                 # Run tests in watch mode
npm run test:run         # Single test run (use in CI)
npm run test:ui          # Open browser test dashboard
npm run test:coverage    # Generate coverage report (v8 provider)
```

**Environment:**
- Copy `.env.example` → `.env.local` and set `VITE_OBA_KEY` for a real OBA API key.
- The build falls back to the public `TEST` key if `VITE_OBA_KEY` is unset.
- `VITE_TARGET` controls build output: `web` (default, includes PWA) or `native` (Capacitor, no service worker).
- Node.js 22+; npm 10+.

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

### App Shell & DOM

- `app-shell.js` — Generates the root HTML structure as a template.
- `app-dom.js` — Caches references to DOM elements for use across modules.
- `event-handlers.js` — Centralizes event listener registration.
- `dialog-lifecycle.js` — Manages dialog open/close state and transitions.

### API Client (`oba.js`)

Key design patterns to preserve:
- **Request queue + deduplication** — concurrent requests for the same endpoint are merged.
- **Stale-while-revalidate caching** — serves cached data immediately, updates in background.
- **Adaptive concurrency** — lowers max concurrent requests when error rate rises.
- **AbortController** — cancels in-flight requests when a dialog closes.
- **Rate limit handling** — cooldown + jitter on 429 responses.

Never bypass `oba.js` to call the OBA API directly.

### Native Integration (`src/native/`)

Capacitor wrappers provide platform-appropriate behavior:
- `platform.js` — Detects Capacitor vs. web at runtime; exports `isNative` and build target.
- `storage.js` — Wraps Capacitor Preferences (native) / localStorage (web).
- `location.js`, `haptics.js`, `share.js`, `splash.js` — Thin wrappers around Capacitor plugins.

Native modules gracefully fall back to web APIs when running in the browser.

---

## Key Conventions

### Code Style

- **No framework** — plain DOM manipulation; avoid introducing React/Vue/etc.
- **No linter/formatter config** — follow the surrounding code style.
- **ES modules** — `import`/`export` throughout; no CommonJS.
- **Modular CSS** — styles split across `src/styles/*.css` by feature area; use CSS custom properties for theming.
- **Mobile-first** — always test at mobile viewport widths; iOS PWA and native compatibility is a priority.

### i18n

All user-visible strings live in `src/copy.js`, keyed by feature area:

```js
export const UI_COPY = {
  myFeature: {
    label: { en: 'English text', 'zh-CN': '中文' },
  }
}
```

Retrieve with `copyValue('myFeature.label')` (defined in `main.js`). Some entries support dynamic interpolation (e.g., `locationFoundNearby: (count) => ...`). Never hardcode display strings in renderers.

### Feature Flags and Constants

All configuration constants, API keys, timing intervals, and feature flags belong in `src/config.js`. Do not scatter magic numbers through modules.

### Module Extraction Pattern

When `main.js` grows too large for a feature area:
1. Create a new module under `src/` (or `src/dialogs/`, `src/renderers/`, `src/native/`).
2. Export focused functions from it.
3. Import and wire up in `main.js`.

Files that commonly change together:
- `main.js` + `styles/*.css` — UI features
- `main.js` + `copy.js` — user-visible strings
- `main.js` + `config.js` — constants and flags
- `main.js` + `oba.js` — API / data flow changes
- `dialogs/station-display.js` + `dialogs/station-render.js` — station dialog work

### Static Data Pipeline

`public/pulse-data.json` is **generated** (gitignored). It is rebuilt by `scripts/build-link-data.mjs` via `npm run refresh:data` (also runs as part of `dev:refresh`). Do not commit it. Do not edit it manually.

---

## Testing

- **Framework:** Vitest with JSDOM environment, v8 coverage provider
- **Location:** Co-located with source — `src/*.test.js`, `src/dialogs/*.test.js`, `src/native/*.test.js`
- **Style:** `describe` / `it` blocks with descriptive names
- **Run for CI:** `npm run test:run`
- **12 test files** covering: store, app-shell, arrivals, arrival-vehicle, favorites, oba, ride-mode, static-data, station-display, utils, vehicles, platform

When adding a new module, add a corresponding `*.test.js` file in the same directory.

---

## Commit Conventions

Use conventional commit prefixes:

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

The workflow uses Node 22, caches GTFS data between runs, and reads `VITE_OBA_KEY` from repository secrets (falls back to `TEST`).

---

## PWA & Native

**Web (PWA):**
- Service worker auto-updates via `vite-plugin-pwa` (Workbox, auto-update mode).
- `pulse-data.json` uses a NetworkFirst caching strategy.
- iOS splash screens for all device sizes are pre-generated in `public/`.
- Do not remove PWA meta tags from `index.html`.

**iOS (Capacitor):**
- `capacitor.config.json` configures the iOS project (app ID: `com.kevinngw.linkpulse`).
- Native builds use `VITE_TARGET=native` which stubs out PWA registration.
- `npm run cap:sync` builds and syncs web assets to the iOS project.
- See `docs/ios-app-store-readiness.md` and `docs/app-store-connect-submission.md` for release notes.

---

## What to Avoid

- Do not introduce npm dependencies without discussion — the project is intentionally dependency-light.
- Do not add a JS framework (React, Vue, Svelte, etc.).
- Do not call the OBA API outside of `oba.js`.
- Do not hardcode user-visible strings — use `UI_COPY` in `copy.js`.
- Do not commit `public/pulse-data.json`.
- Do not modify `public/` PWA icons or splash screens unless updating assets intentionally.
