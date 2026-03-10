import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE ?? '/link/'

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
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
  ],
})
