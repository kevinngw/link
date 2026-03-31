# Link Pulse

Real-time transit tracking for Seattle Link light rail. Available as a PWA and native iOS app.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tests](https://img.shields.io/badge/tests-vitest-green.svg)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20iOS-blue.svg)

## Features

### Real-Time Transit Data
- Live train and bus positions with arrival times
- Multi-system support: Link Light Rail, RapidRide, Swift
- Station arrival predictions with delay indicators
- Service alerts and disruption notices

### Performance Optimized
- **Stale-while-revalidate caching** with background refresh
- **Adaptive concurrency** adjusts 1-6 parallel requests based on success rate
- **Request deduplication** shares in-flight requests for same endpoint
- **Virtual scrolling** for smooth 60fps rendering
- **Prefetch on hover** preloads station data with 100ms delay

### Resilient Request Handling
- AbortController support for request cancellation
- FIFO queue with exponential backoff retry
- Global error boundary with graceful fallbacks
- Web Vitals monitoring (LCP, CLS, FID)

### Keyboard Navigation
Vim-inspired shortcuts:

| Key | Action |
|-----|--------|
| `j` / `k` | Next / previous item |
| `h` / `l` | Previous / next tab |
| `1` `2` `3` | Map / Trains / Insights |
| `/` | Search stations |
| `r` | Refresh data |
| `Space` | Toggle display mode |
| `Esc` | Close dialog |

### Native iOS Features
- Local push notifications for train arrival alerts
- Native geolocation for nearby station detection
- Haptic feedback on interactions
- Native share sheet
- Splash screen with smooth transition

### Accessibility
- Skip-to-content link
- ARIA live regions for announcements
- Focus trap in dialogs
- Full keyboard-only navigation

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Xcode 15+ (for iOS builds)

### Install
```bash
git clone https://github.com/kevinngw/link.git
cd link
npm install
```

### Web Development
```bash
npm run dev
# Open http://localhost:5173/link/
```

### iOS Development
```bash
npm run ios
# Opens Xcode — select a simulator or device and hit Run
```

### Production Build
```bash
# Web (PWA)
npm run build

# iOS
npm run build:ios
npm run cap:sync
```

### Run Tests
```bash
npm test           # Watch mode
npm run test:run   # Single run
npm run test:ui    # Interactive UI
npm run test:coverage
```

## Architecture

### Dual Build System

The project supports two build targets from a single codebase:

| Target | Base Path | PWA | Service Worker | Native Plugins |
|--------|-----------|-----|----------------|----------------|
| Web | `/link/` | Yes | Yes | No |
| iOS (Capacitor) | `/` | No | Stub | Yes |

Set `VITE_CAPACITOR=true` to build for iOS. The PWA plugin is replaced with a no-op stub, and Capacitor's native HTTP layer handles API requests (bypassing CORS).

### Project Structure

```
src/
├── main.js              # Application entry point
├── store.js             # Reactive store (Proxy-based)
├── app-store.js         # Application state and actions
├── config.js            # API config, cache TTLs, i18n strings
├── oba.js               # OneBusAway API client (SWR, dedup, retry)
├── arrivals.js          # Arrival data processing
├── error-boundary.js    # Error handling and Web Vitals
├── keyboard-nav.js      # Keyboard shortcut system
├── virtual-scroll.js    # Virtual scrolling for large lists
├── formatters.js        # Date, time, number formatting
├── insights.js          # Transit analytics
├── vehicles.js          # Vehicle state parsing
├── static-data.js       # Static data loading
├── utils.js             # Utility functions
├── native/              # Capacitor native modules
│   ├── platform.js      # Platform detection (web vs iOS)
│   ├── notifications.js # Local push notifications
│   ├── geolocation.js   # Native geolocation with web fallback
│   ├── haptics.js       # Haptic feedback
│   ├── splash.js        # Splash screen control
│   └── share.js         # Native share with web fallback
├── renderers/
│   ├── map.js           # Map view
│   ├── trains.js        # Trains list view
│   └── insights.js      # Analytics dashboard
├── dialogs/
│   ├── dom.js           # Dialog DOM structure
│   ├── overlays.js      # Overlay management
│   ├── station-display.js
│   └── station-render.js
└── *.test.js            # Unit tests

ios/                     # Xcode project (Capacitor-generated)
capacitor.config.json    # Capacitor configuration
```

### Request Flow
```
User Action → Store → OBA Client → Queue → fetch()
                         ↓            ↓
                    Dedup Check    Retry (exp. backoff)
                         ↓            ↓
                    SWR Cache     AbortController
```

### Native Module Pattern

All native modules use lazy dynamic imports and gracefully degrade on web:

```javascript
import { isNative } from './native/platform'

// Native geolocation with automatic web fallback
const position = await getCurrentPosition()

// Haptics — no-op on web, vibration on iOS
await lightImpact()

// Notifications — only available on native
await scheduleArrivalAlert('Capitol Hill', '1 Line', 3)
```

## Configuration

### Environment Variables
```bash
# .env.local
VITE_OBA_KEY=your_api_key_here    # OneBusAway API key
VITE_CAPACITOR=true               # Enable iOS build mode
VITE_BASE=/link/                  # Base path (web only)
```

Without `VITE_OBA_KEY`, the app uses the public `TEST` key with reduced rate limits.

### Cache Configuration

Edit `src/config.js` to adjust timing:

```javascript
// Production profile (with API key)
ARRIVALS_CACHE_TTL_MS: 60_000     // 1 minute
OBA_CACHE_TTL_MS: 60_000
MAX_CONCURRENT_REQUESTS: 3
COOLDOWN_BASE_MS: 10_000

// Test profile (public key)
ARRIVALS_CACHE_TTL_MS: 120_000    // 2 minutes
MAX_CONCURRENT_REQUESTS: 1
COOLDOWN_BASE_MS: 30_000
```

## iOS App Store

### Build for Distribution
1. Run `npm run ios` to open Xcode
2. Set your Signing Team under Signing & Capabilities
3. Add a 1024x1024 App Icon (no transparency) to `Assets.xcassets`
4. Set LaunchScreen.storyboard background to `#08141f`
5. Product > Archive > Distribute to App Store Connect

### Native Features for Review Compliance
The app includes five native integrations beyond web capabilities:
- **Local notifications** for train arrival alerts
- **Native geolocation** with iOS permission flow
- **Haptic feedback** on station selection
- **Native share sheet** with full iOS integration
- **Splash screen** with controlled dismissal

### App Store Metadata
- **Bundle ID**: `com.linkpulse.app`
- **Category**: Travel / Navigation
- **Minimum iOS**: 16.0
- **Privacy**: Location used for nearby stations only; preferences stored locally; no personal data collected

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |

Requires: ES2020+, IntersectionObserver, ResizeObserver, AbortController

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Transit data from [OneBusAway](https://onebusaway.org/) API
- Service data from Sound Transit, King County Metro, and Community Transit
