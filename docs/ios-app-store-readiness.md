# iOS App Store Readiness Audit

Date: 2026-03-30

## Conclusion

This project is already a strong mobile-oriented web app, but it is not yet an iOS app project.
The fastest realistic path to App Store is:

1. Keep the current web UI and package it with Capacitor.
2. Replace a few browser-only integrations with Capacitor plugins.
3. Add the native metadata, privacy files, and App Store assets Apple requires.
4. Add at least one clearly native, durable iOS feature so the submission is less likely to be treated as a thin website wrapper.

Current assessment:

- Technical conversion difficulty: low to medium
- App Store review risk as a straight web wrapper: medium to high
- Best packaging approach: Capacitor

## What The App Already Has

The existing product already has enough product depth to justify a mobile app direction if we present it well:

- realtime transit map
- station arrivals dialogs
- favorites
- nearby station search
- system switching across Link / RapidRide / Swift
- insights dashboard
- bilingual UI
- installable PWA shell and app icons

Relevant code locations:

- Main app shell: [src/main.js](../src/main.js)
- Realtime API config: [src/config.js](../src/config.js)
- Station geolocation search: [src/station-search.js](../src/station-search.js)
- Favorites persistence: [src/favorites.js](../src/favorites.js)
- Recent stations persistence: [src/recent-stations.js](../src/recent-stations.js)
- PWA setup: [vite.config.js](../vite.config.js)
- Data build pipeline: [scripts/build-link-data.mjs](../scripts/build-link-data.mjs)

## Current Web-Only Assumptions

These parts work in a browser today, but should be adapted for a shipped iOS binary:

### 1. Service worker and PWA behavior

The app currently registers a service worker and ships a PWA manifest.

For a native iOS shell, the service worker is not the core deployment primitive anymore.
Recommendation: keep web support, but disable or bypass SW registration in native builds to simplify cache invalidation and review/debugging.

**Status: Done** — `vite.config.js` conditionally disables `vite-plugin-pwa` when `VITE_CAPACITOR=true`, and SW registration is guarded by `isNative()` in `src/main.js`.

### 2. localStorage and sessionStorage

Current usage:

- favorites: `src/favorites.js`
- recent stations: `src/recent-stations.js`
- recent searches: `src/station-search.js`
- theme/language preferences: `src/main.js`

For native builds, these should move to Capacitor Preferences so data survives more reliably and matches current Apple privacy-manifest expectations.

**Status: Done** — `src/native/storage.js` provides a dual-layer abstraction (in-memory cache + Capacitor Preferences on native / localStorage on web). All four consumers have been migrated.

### 3. Browser geolocation

Current usage:

- location request flow: `src/station-search.js`

This should move to `@capacitor/geolocation` so permissions and error handling are managed explicitly in the native app.

**Status: Done** — `src/native/geolocation.js` wraps Capacitor Geolocation with web fallback. `src/station-search.js` uses it.

### 4. Browser share and clipboard

Current usage:

- share / clipboard fallback: `src/main.js`

This should move to Capacitor Share and, if needed, Capacitor Clipboard for more predictable iOS behavior.

**Status: Done** — `src/native/share.js` uses Capacitor Share on native, falls back to `navigator.share`, then Capacitor Clipboard / `navigator.clipboard`.

### 5. Build pipeline depends on live network downloads

Static transit data is regenerated during build. For App Store and CI builds we should avoid a release pipeline that can fail just because GTFS endpoints are temporarily unavailable.

Recommendation:

- separate "refresh transit data" from "build app binary"
- commit or artifact the generated JSON for release builds
- make iOS release builds consume already-generated assets

**Status: Partially done** — `predev` skips the GTFS download if `pulse-data.json` already exists.

## Recommended Packaging Strategy

Use Capacitor, not a full native rewrite.

Why:

- the app is already a polished mobile web app
- UI logic is concentrated in vanilla JS and can be reused almost entirely
- the product does not currently need heavy native rendering or deep background processing
- Capacitor is an officially maintained path for shipping web-first apps to iOS

High-level setup:

1. Add `@capacitor/core`, `@capacitor/cli`, and `@capacitor/ios`
2. Create `capacitor.config.json`
3. Set `webDir` to `dist`
4. Add `ios/` project via `npx cap add ios`
5. Sync the built web bundle into the native project with `npx cap sync`
6. Open and archive/sign in Xcode

**Status: Done**

## App Store Risk Assessment

### Main review risk: Guideline 4.2

The biggest non-technical risk is not "can it run on iOS", but whether Apple sees it as sufficiently more valuable than a website.

This app is better positioned than a generic marketing site because it already has:

- live operational utility
- personalized favorites
- nearby station lookup
- a focused single-purpose mobile workflow
- offline/static data packaging

But a straight WKWebView wrapper is still at risk if the submission feels like "the website, inside an app."

## What To Add To Lower Review Risk

I recommend shipping at least one or two of these in the first App Store version:

### Option A: native home screen widgets

Best risk reducer.
Show nearest station or favorite station ETAs on the home screen / lock screen.

### Option B: station alerts / favorite station notifications

Notify users about major service disruptions or approaching favorite commute windows.
This is strong product value, but requires backend or scheduled refresh logic.

### Option C: iOS-style saved station shortcuts

Add native quick actions, Siri Shortcuts, or Spotlight entry points for favorite stations.

### Option D: true offline favorites mode

Allow favorites, recent stations, and the last successful arrival snapshot to remain readable without network.
This is easier than push and still adds mobile-specific value.

If we want the fastest path with good approval odds, my recommendation is:

1. Capacitor wrapper
2. Native storage + geolocation + share migration
3. Widget support for favorite stations
4. Cleaner native startup and settings screens

## Concrete Code Changes — Current Status

### Phase 1: native shell — **Done**

- [x] Capacitor dependencies added
- [x] `capacitor.config.json` created
- [x] iOS project generated (`ios/`)
- [x] Build output native-safe (`VITE_CAPACITOR=true`, `base: '/'`)

### Phase 2: runtime adaptation — **Done**

- [x] `src/native/platform.js` — `isNative()`, `isIOS()`, `isWeb()`
- [x] SW registration disabled in native builds
- [x] `src/native/storage.js` — Capacitor Preferences / localStorage adapter
- [x] `src/native/geolocation.js` — Capacitor Geolocation adapter
- [x] `src/native/share.js` — Capacitor Share + Clipboard adapter
- [x] `src/native/haptics.js` — tactile feedback
- [x] `src/native/splash.js` — splash screen control

### Phase 3: App Store compliance — **Partially done**

- [x] `Info.plist` — `NSLocationWhenInUseUsageDescription`
- [x] `PrivacyInfo.xcprivacy` — UserDefaults usage declaration (CA92.1)
- [ ] App Privacy answers in App Store Connect
- [ ] Privacy Policy URL
- [ ] Screenshots, icon, subtitle, keywords, review notes

### Phase 4: approval hardening — **Not started**

- [ ] At least one native-only feature (widgets, notifications, or shortcuts)
- [ ] Test on real iPhone hardware
- [ ] Verify app launch, offline behavior, permission prompts, background/foreground refresh

## App Store Metadata And Compliance Checklist

Before submission, prepare:

- [ ] Apple Developer account ($99/yr)
- [ ] App Store Connect app record
- [ ] Bundle ID: `com.linkpulse.app`
- [ ] Signing certificates and provisioning
- [ ] App name / subtitle / keywords
- [ ] Screenshots for iPhone 6.9", 6.3", 6.7", 6.5", 5.5"
- [ ] Privacy Policy page
- [ ] App Privacy questionnaire answers
- [ ] Export compliance answer
- [ ] Review notes explaining transit data source and any limited-access APIs

## Native Modules Introduced

| Module | Purpose | Web fallback |
|--------|---------|--------------|
| `src/native/platform.js` | Platform detection | Returns `false` for `isNative()` |
| `src/native/storage.js` | Persistent key-value storage | `localStorage` / `sessionStorage` |
| `src/native/geolocation.js` | GPS location | `navigator.geolocation` |
| `src/native/share.js` | Share sheet + clipboard | `navigator.share` / `navigator.clipboard` |
| `src/native/haptics.js` | Tactile feedback | No-op |
| `src/native/splash.js` | Splash screen hide | No-op |

## Source-Backed Requirements

- [Apple App Review Guidelines 4.2](https://developer.apple.com/appstore/resources/approval/guidelines.html)
- [App Privacy configuration](https://developer.apple.com/documentation/bundleresources/app-privacy-configuration)
- [Third-party SDK requirements](https://developer.apple.com/support/third-party-SDK-requirements/)
- [Capacitor workflow](https://capacitorjs.com/docs/basics/workflow)
- [Capacitor Preferences](https://capacitorjs.com/docs/apis/preferences)
- [Capacitor Geolocation](https://capacitorjs.com/docs/apis/geolocation)
- [Capacitor Share](https://capacitorjs.com/docs/apis/share)
