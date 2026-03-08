import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE ?? '/link/'

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Link Pulse',
        short_name: 'Link Pulse',
        description: 'Realtime pulse map for Seattle Link 1 Line and 2 Line trains.',
        theme_color: '#08141f',
        background_color: '#08141f',
        display: 'standalone',
        display_override: ['standalone', 'browser'],
        start_url: base,
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
            src: `${base}icon.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
})
