import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const isCapacitor = process.env.VITE_CAPACITOR === 'true'
const base = isCapacitor ? '/' : (process.env.VITE_BASE ?? '/link/')

// Stub for virtual:pwa-register when PWA plugin is disabled (Capacitor builds)
function pwaRegisterStub() {
  const virtualId = 'virtual:pwa-register'
  const resolvedId = '\0' + virtualId
  return {
    name: 'pwa-register-stub',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) return 'export function registerSW() { return () => {} }'
    },
  }
}

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'transit-api': ['./src/oba.js', './src/arrivals.js'],
          'transit-data': ['./src/static-data.js', './src/vehicles.js', './src/insights.js'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },
  },
  plugins: [
    isCapacitor && pwaRegisterStub(),
    !isCapacitor && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'apple-touch-icon.png',
        'apple-touch-icon-120.png',
        'apple-touch-icon-152.png',
        'apple-touch-icon-167.png',
        'apple-touch-icon-180.png',
        'apple-splash-iphone-se-640x1136.png',
        'apple-splash-iphone-8-750x1334.png',
        'apple-splash-iphone-8-plus-1242x2208.png',
        'apple-splash-iphone-x-xs-11pro-1125x2436.png',
        'apple-splash-iphone-xr-828x1792.png',
        'apple-splash-iphone-xs-max-11pro-max-1242x2688.png',
        'apple-splash-iphone-12-13-14-1170x2532.png',
        'apple-splash-iphone-12-13-14-pro-max-1284x2778.png',
        'apple-splash-iphone-15-16-pro-1179x2556.png',
        'apple-splash-iphone-15-plus-16-plus-1290x2796.png',
        'apple-splash-ipad-9-10-1536x2048.png',
        'apple-splash-ipad-mini-air-1640x2360.png',
        'apple-splash-ipad-pro-10_5-1668x2224.png',
        'apple-splash-ipad-pro-11-1668x2388.png',
        'apple-splash-ipad-pro-12_9-2048x2732.png',
      ],
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globIgnores: ['**/pulse-data.json'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/pulse-data\.json(?:\?.*)?$/.test(url.pathname + url.search),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pulse-data',
              expiration: {
                maxEntries: 1,
              },
            },
          },
        ],
      },
      manifest: {
        id: base,
        name: 'Link Pulse',
        short_name: 'Link Pulse',
        description: 'Realtime pulse map for Seattle Link 1 Line and 2 Line trains.',
        theme_color: '#08141f',
        background_color: '#08141f',
        display: 'standalone',
        display_override: ['standalone', 'browser'],
        orientation: 'portrait',
        lang: 'en-US',
        scope: base,
        start_url: base,
        prefer_related_applications: false,
        categories: ['travel', 'navigation', 'transit'],
        icons: [
          {
            src: `${base}icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${base}icon-maskable-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: `${base}icon-maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: `${base}icon.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ].filter(Boolean),
  define: {
    'import.meta.env.VITE_CAPACITOR': JSON.stringify(process.env.VITE_CAPACITOR || ''),
  },
})
