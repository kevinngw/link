<!-- Generated: 2026-03-17 | Files scanned: 25 | Token estimate: ~600 -->

# Data Architecture

## Static Data Pipeline

```
OBA GTFS API
     |
scripts/build-link-data.mjs
     |
     ├── public/pulse-data.json        (index: system metadata)
     └── public/pulse-data-{id}.json   (full: lines, stops, shapes)
```

**build-link-data.mjs** fetches from OBA API:
- Direction groups → line definitions
- Stop sequences → station coordinates, aliases, segment times
- Shape geometry → polyline decoding → route paths
- Systems: link, rapidride, swift

## Runtime Data Loading

```
static-data.js
├── loadStaticData()       → load index + default system
├── loadSystemDataById()   → lazy-load additional systems
├── buildLayout(line)      → station positions, gaps, track geometry
└── applySystemState()     → switch active system, clear caches
```

## Realtime Data

### OBA Client (oba.js)

```
fetchJsonWithRetry(url, label, signal?, forceFresh?)
├── Check queue: dedup in-flight requests
├── Check cache: fresh → return, stale → return + revalidate
├── Fetch with AbortController (10s timeout)
├── Retry: up to 3 attempts for transient errors
└── Cache result with TTL
```

**Cache strategy:** Stale-While-Revalidate
- Fresh: 0 → TTL (60s prod, 120s test)
- Stale: TTL → 2x TTL (serve + background refresh)
- Expired: > 2x TTL (must fetch)

### Arrivals (arrivals.js)

```
fetchArrivalsForStopIds(stopIds, signal)
├── Adaptive concurrency: [1, 6], starts at 3 (prod)
├── Batch fetch with success-rate adjustment
├── Per-station cache (60s prod, 120s test)
└── Merge + classify by direction (NB/SB)
```

## Config Profiles (config.js)

| Setting | TEST | PROD |
|---------|------|------|
| Arrivals cache TTL | 120s | 60s |
| OBA cache TTL | 120s | 60s |
| Concurrency | 1 | 3 |
| Vehicle refresh | 45s | 15s |
| Dialog refresh | 90s | 30s |
| Cooldown base | 30s | 10s |
| Cooldown max | 180s | 60s |

## Transit Systems

| System | Agency | Vehicle Label |
|--------|--------|---------------|
| link | Sound Transit (40) | train/trains |
| rapidride | King County Metro (1) | bus/buses |
| swift | Community Transit (29) | bus/buses |
