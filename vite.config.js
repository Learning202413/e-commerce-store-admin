import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    port: 5175,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://sistematextil.pp.ua',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})