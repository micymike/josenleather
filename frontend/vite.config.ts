import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      workbox: {
        globDirectory: 'dist'
      },
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Josen Nairobi',
        short_name: 'Josen Nairobi',
        description: 'An awesome progressive web app built with React + Vite',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/android/android-launchericon-48-48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/android/android-launchericon-72-72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/android/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    }
  },
  server: {
    port: 5174,
    host: true,
    allowedHosts: ['josenleather.onrender.com', 'https://josenleather-frontend.onrender.com', 'www.josenleather.com']
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  }
})
