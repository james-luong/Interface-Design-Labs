import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Forward /api requests to the Express backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
