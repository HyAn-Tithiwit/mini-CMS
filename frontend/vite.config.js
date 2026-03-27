// File: vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Thêm import này

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Thêm plugin này vào
  ],
})