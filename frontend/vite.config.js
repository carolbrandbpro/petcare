import { defineConfig } from 'vite'

export default defineConfig({
  base: '/petcare/',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: { overlay: false }
  },
  preview: { host: true, port: 5173, strictPort: true }
})
