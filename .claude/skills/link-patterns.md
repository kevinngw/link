---
name: link-patterns
description: Coding patterns extracted from the Link transit app repository
version: 1.0.0
source: local-git-analysis
analyzed_commits: 127
---

# Link Patterns

## Project Overview

Link is a **transit/light rail PWA** built with vanilla JavaScript and Vite. It displays real-time arrivals, station maps, and transfer information using the OneBusAway (OBA) API. The app is bilingual (English/Chinese).

## Commit Conventions

Mixed convention — ~40% use **conventional commits** (`feat:`, `fix:`, `refactor:`, `docs:`), ~17% use **Chinese-language** descriptive messages. Recent commits trend toward conventional format.

Common prefixes:
- `feat:` — New user-facing features
- `fix:` — Bug fixes (often mobile/layout)
- `refactor:` — Code extraction and reorganization
- `docs:` — README updates

## Code Architecture

```
src/
├── main.js              # App entry point and orchestration (most-changed file)
├── config.js            # Constants, API keys, feature flags
├── style.css            # All styles (2nd most-changed file)
├── oba.js               # OBA API client with request queue, caching, dedup
├── arrivals.js          # Arrival data processing and concurrency control
├── vehicles.js          # Vehicle tracking
├── static-data.js       # GTFS/static transit data loader
├── utils.js             # Distance, formatting utilities
├── formatters.js        # Display formatters
├── insights.js          # Analytics/insights helpers
├── store.js             # Reactive state store
├── app-store.js         # Application-level store
├── virtual-scroll.js    # Virtual scrolling for performance
├── keyboard-nav.js      # Keyboard navigation / a11y
├── error-boundary.js    # Error boundary and perf monitoring
├── dialogs/
│   ├── dom.js           # Dialog DOM helpers
│   ├── overlays.js      # Overlay management
│   ├── station-display.js  # Station dialog display logic
│   └── station-render.js   # Station dialog rendering
└── renderers/
    ├── map.js           # Line diagram / map renderer
    ├── trains.js        # Train list renderer
    └── insights.js      # Insights renderer
```

### Key architectural patterns:
- **Vanilla JS** — No framework; DOM manipulation directly
- **Module extraction** — Large refactors split `main.js` into focused modules (`oba.js`, `arrivals.js`, `config.js`, `dialogs/*`, `renderers/*`)
- **Progressive loading** — Station dialogs load incrementally; transfers delayed 5s after arrivals
- **Request management** — OBA client uses queue, dedup, stale-while-revalidate caching, adaptive concurrency, AbortController cancellation

## Workflows

### Adding a New Feature
1. Typically touches `src/main.js` + `src/style.css` + `src/config.js`
2. Config constants go in `src/config.js`
3. Styles go in `src/style.css` (single stylesheet)
4. Heavy logic gets extracted to a dedicated module

### Refactoring
1. Extract logic from `main.js` into a new module under `src/` or `src/dialogs/` or `src/renderers/`
2. Export functions from the new module
3. Import and wire up in `main.js`

### Mobile-First Bug Fixes
- Mobile layout fixes are frequent — always test mobile viewport
- iOS PWA compatibility is a priority (splash screens, meta tags)

### Static Data Pipeline
1. `scripts/build-link-data.mjs` generates transit data
2. Runs automatically via `predev` and `prebuild` npm scripts
3. Output consumed by `src/static-data.js`

## Testing Patterns

- **Framework:** Vitest
- **Test files:** Co-located with source (`src/*.test.js`)
- **Run:** `npm test` (watch), `npm run test:run` (CI)
- **Coverage:** `npm run test:coverage`
- **Test naming:** Descriptive with `describe`/`it` blocks

## File Co-Change Patterns

Files that frequently change together:
- `main.js` + `style.css` (UI features)
- `main.js` + `config.js` (feature additions)
- `main.js` + `oba.js` (API/data flow changes)
- `config.js` + `style.css` + `main.js` (new features)
- `dialogs/station-display.js` + `dialogs/station-render.js` (station dialog work)

## API & Performance Patterns

- OBA API requests go through `src/oba.js` queue with dedup and caching
- Rate limiting is mitigated via request merging, cooldowns, and jitter
- AbortController used to cancel in-flight requests on dialog close
- Adaptive concurrency adjusts based on success rate
