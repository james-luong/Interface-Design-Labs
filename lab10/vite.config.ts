import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // Relative base so built assets work in any subdirectory on Mercury
  base: './',

  server: {
    proxy: {
      // Forward /api/* to the local PHP dev server (php -S localhost:8000)
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
