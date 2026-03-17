<!-- Generated: 2026-03-16 | Files scanned: 25 | Token estimate: ~700 -->

# Architecture

## System Overview

Vanilla JS PWA for real-time transit tracking (Link light rail, RapidRide, Swift).
Built with Vite, no framework. Bilingual (en/zh-CN). Offline-first via service worker.

## Data Flow

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

## Module Dependency Graph

```
main.js (orchestrator, 2688 lines)
├── config.js          constants, API keys, i18n copy
├── app-store.js       reactive state + actions
│   └── store.js       proxy-based reactive store
├── static-data.js     GTFS data loader + layout builder
├── oba.js             API client (queue, dedup, SWR cache)
├── arrivals.js        arrival fetching + adaptive concurrency
├── vehicles.js        vehicle parsing + status classification
├── formatters.js      date/time i18n formatting
├── utils.js           distance, slugify, helpers
├── insights.js        headway/delay analytics
├── error-boundary.js  global error handler + perf monitor
├── keyboard-nav.js    vim-style keyboard navigation
├── virtual-scroll.js  virtual scrolling for large lists
├── dialogs/
│   ├── dom.js              cached dialog element selectors
│   ├── overlays.js         train + alert dialog renderers
│   ├── station-display.js  marquee board display mode
│   └── station-render.js   station arrival list rendering
└── renderers/
    ├── map.js         SVG line diagram with vehicles
    ├── trains.js      vehicle queue list view
    └── insights.js    service health dashboard
```

## State Management

Proxy-based reactive store (`store.js`) with property-level subscribers.
`app-store.js` adds domain actions (`setTab`, `setLine`, `updateVehicles`, etc.)
and computed properties (`visibleLines`, `hasError`, `isLoading`).

## Build Pipeline

```
npm run dev  →  build-link-data.mjs (predev hook) → Vite dev server
npm run build → build-link-data.mjs (prebuild hook) → Vite production build
```

## PWA Strategy

- Service worker: auto-update (`vite-plugin-pwa`)
- Data caching: NetworkFirst for `pulse-data.json`
- App caching: default Workbox strategy
- Apple splash screens for all iOS devices
