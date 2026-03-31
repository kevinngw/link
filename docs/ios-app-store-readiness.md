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

- Main app shell: [src/main.js](/Users/kevinwu/Workspace/link/src/main.js)
- Realtime API config: [src/config.js](/Users/kevinwu/Workspace/link/src/config.js)
- Station geolocation search: [src/station-search.js](/Users/kevinwu/Workspace/link/src/station-search.js)
- Favorites persistence: [src/favorites.js](/Users/kevinwu/Workspace/link/src/favorites.js)
- Recent stations persistence: [src/recent-stations.js](/Users/kevinwu/Workspace/link/src/recent-stations.js)
- PWA setup: [vite.config.js](/Users/kevinwu/Workspace/link/vite.config.js)
- Data build pipeline: [scripts/build-link-data.mjs](/Users/kevinwu/Workspace/link/scripts/build-link-data.mjs)

## Current Web-Only Assumptions

These parts work in a browser today, but should be adapted for a shipped iOS binary:

### 1. Service worker and PWA behavior

The app currently registers a service worker and ships a PWA manifest.

- SW registration: [src/main.js:2](/Users/kevinwu/Workspace/link/src/main.js:2)
- SW setup: [src/main.js:94](/Users/kevinwu/Workspace/link/src/main.js:94)
- PWA plugin + manifest: [vite.config.js:22](/Users/kevinwu/Workspace/link/vite.config.js:22)

For a native iOS shell, the service worker is not the core deployment primitive anymore.
Recommendation: keep web support, but disable or bypass SW registration in native builds to simplify cache invalidation and review/debugging.

### 2. localStorage and sessionStorage

Current usage:

- favorites: [src/favorites.js:10](/Users/kevinwu/Workspace/link/src/favorites.js:10)
- recent stations: [src/recent-stations.js:10](/Users/kevinwu/Workspace/link/src/recent-stations.js:10)
- recent searches: [src/station-search.js:50](/Users/kevinwu/Workspace/link/src/station-search.js:50)

For native builds, these should move to Capacitor Preferences so data survives more reliably and matches current Apple privacy-manifest expectations.

### 3. Browser geolocation

Current usage:

- location request flow: [src/station-search.js:133](/Users/kevinwu/Workspace/link/src/station-search.js:133)

This should move to `@capacitor/geolocation` so permissions and error handling are managed explicitly in the native app.

### 4. Browser share and clipboard

Current usage:

- share / clipboard fallback: [src/main.js:1451](/Users/kevinwu/Workspace/link/src/main.js:1451)

This should move to Capacitor Share and, if needed, Capacitor Clipboard for more predictable iOS behavior.

### 5. Build pipeline depends on live network downloads

Static transit data is regenerated during build:

- GTFS downloads: [scripts/build-link-data.mjs:16](/Users/kevinwu/Workspace/link/scripts/build-link-data.mjs:16)
- remote ZIP fetch retry loop: [scripts/build-link-data.mjs:215](/Users/kevinwu/Workspace/link/scripts/build-link-data.mjs:215)

This worked when network access was available, but failed in a restricted environment. For App Store and CI builds we should avoid a release pipeline that can fail just because GTFS endpoints are temporarily unavailable.

Recommendation:

- separate "refresh transit data" from "build app binary"
- commit or artifact the generated JSON for release builds
- make iOS release builds consume already-generated assets

## Recommended Packaging Strategy

Use Capacitor, not a full native rewrite.

Why:

- the app is already a polished mobile web app
- UI logic is concentrated in vanilla JS and can be reused almost entirely
- the product does not currently need heavy native rendering or deep background processing
- Capacitor is an officially maintained path for shipping web-first apps to iOS

High-level setup:

1. Add `@capacitor/core`, `@capacitor/cli`, and `@capacitor/ios`
2. Create `capacitor.config.*`
3. Set `webDir` to `dist`
4. Add `ios/` project via `npx cap add ios`
5. Sync the built web bundle into the native project with `npx cap sync`
6. Open and archive/sign in Xcode

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

## Concrete Code Changes To Make

### Phase 1: native shell

- add Capacitor dependencies
- create Capacitor config
- generate iOS project
- make build output work from `/` instead of GitHub Pages-only `/link/` assumptions when building native

### Phase 2: runtime adaptation

- add native platform detection helper
- disable service worker registration in native builds
- replace `localStorage` / `sessionStorage` access with a storage adapter
- replace `navigator.geolocation` with a location adapter
- replace `navigator.share` / `navigator.clipboard` with a share adapter

### Phase 3: App Store compliance

- add `Info.plist` permission strings for location
- add `PrivacyInfo.xcprivacy`
- add App Privacy answers in App Store Connect
- add Privacy Policy URL
- prepare screenshots, icon, subtitle, keywords, and review notes

### Phase 4: approval hardening

- add at least one native-only feature
- test on real iPhone hardware
- verify app launch, offline behavior, permission prompts, background/foreground refresh, and external links

## Native Adapters To Introduce

To avoid scattering platform checks across the app, add small adapters:

- `src/native/platform.js`
- `src/native/storage.js`
- `src/native/location.js`
- `src/native/share.js`

Suggested behavior:

- web build keeps current browser behavior
- native build routes through Capacitor plugins
- main application code calls a stable internal interface

## App Store Metadata And Compliance Checklist

Before submission, prepare:

- Apple Developer account
- App Store Connect app record
- Bundle ID
- signing certificates and provisioning
- app name / subtitle / keywords
- screenshots for iPhone sizes
- privacy policy page
- App Privacy questionnaire answers
- export compliance answer
- review notes explaining transit data source and any limited-access APIs

## Source-Backed Requirements

Official references reviewed during this audit:

- Apple App Review Guidelines 4.2 says an app should go beyond a repackaged website and that apps should not primarily be web clippings or collections of links:
  [Apple App Review Guidelines](https://developer.apple.com/appstore/resources/approval/guidelines.html)
- Apple App Store Connect requires a Privacy Policy URL and App Privacy disclosure:
  [App information reference](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information)
  [Manage app privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)
- Apple documents privacy manifests for app and SDK submission:
  [App privacy configuration](https://developer.apple.com/documentation/bundleresources/app-privacy-configuration)
  [Third-party SDK requirements](https://developer.apple.com/support/third-party-SDK-requirements/)
- Capacitor workflow for building, syncing, and compiling native apps:
  [Capacitor workflow](https://capacitorjs.com/docs/basics/workflow)
- Capacitor recommends Preferences instead of relying on `window.localStorage` on mobile OSs:
  [Capacitor Preferences](https://capacitorjs.com/docs/apis/preferences)
- Capacitor geolocation requires iOS location usage descriptions:
  [Capacitor Geolocation](https://capacitorjs.com/docs/apis/geolocation)
- Capacitor share support:
  [Capacitor Share](https://capacitorjs.com/docs/apis/share)

## Suggested Implementation Order

If we continue from here, the lowest-risk order is:

1. Scaffold Capacitor and iOS project
2. Add runtime adapters for storage, location, and share
3. Make build output native-safe
4. Add privacy manifest and iOS permission strings
5. Implement one native-only feature
6. Test on simulator and real device
7. Prepare App Store metadata and submit

## Bottom Line

This app does not need a full SwiftUI rewrite to get onto the App Store.
It does need:

- a native wrapper
- a small integration layer for iOS-safe APIs
- App Store compliance metadata
- one clearly native feature to reduce review risk

If we want, the next concrete step should be scaffolding Capacitor and introducing the adapter layer without changing the product UI.
