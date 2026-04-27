import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /api calls to the backend during development
      '/api': {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
