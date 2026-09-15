import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { vercelApiDevPlugin } from './api-dev-server.js'

export default defineConfig({
  plugins: [
    vercelApiDevPlugin(),
    react(),
    tailwindcss(),
  ],
})
