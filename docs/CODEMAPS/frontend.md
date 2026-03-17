<!-- Generated: 2026-03-16 | Files scanned: 25 | Token estimate: ~800 -->

# Frontend Architecture

## Entry Point

`index.html` → `src/main.js` (ES module) → `<div id="app">`

## View Hierarchy

```
App
├── Header (theme toggle, language toggle, search button)
├── Tab Bar (lines / trains / insights)
├── Board Area
│   ├── Map View        → renderers/map.js (SVG line diagram)
│   ├── Train List View → renderers/trains.js (vehicle queue)
│   └── Insights View   → renderers/insights.js (health dashboard)
└── Dialog Overlays
    ├── Station Dialog  → dialogs/station-render.js + station-display.js
    ├── Train Dialog    → dialogs/overlays.js
    ├── Alert Dialog    → dialogs/overlays.js
    └── Search Dialog   → main.js (inline)
```

## Key Renderers

| Renderer | File | Output |
|----------|------|--------|
| Line map | `renderers/map.js` | SVG: stations, vehicles, ghost trails, segments |
| Train queue | `renderers/trains.js` | HTML: grouped vehicle cards with ETA |
| Insights | `renderers/insights.js` | HTML: headway gaps, delay buckets, health cards |

## Dialog System

| Dialog | Files | Trigger |
|--------|-------|---------|
| Station | `station-render.js` + `station-display.js` | Map station click |
| Train | `overlays.js` | Train list item click |
| Alert | `overlays.js` | Alert badge click |
| Search | `main.js` | `/` key or search button |

**Station dialog features:**
- Direction tabs (NB/SB)
- Live arrivals with countdown
- Display mode (marquee board with auto-scroll/rotate)
- Deep linking via URL params

## Keyboard Navigation (keyboard-nav.js)

```
j/↓: next    k/↑: prev    h/←: prevTab    l/→: nextTab
Enter: select    Esc: close    Space: toggleDisplay    r: refresh
/: search    1-3: tab select    b/n/s: direction filter
```

## Styling

Single stylesheet: `src/style.css` (3693 lines)
- Mobile-first responsive
- CSS custom properties for theming
- No CSS framework

## i18n

Bilingual copy in `config.js` → `copyValue(key)` helper
Languages: `en`, `zh-CN`
