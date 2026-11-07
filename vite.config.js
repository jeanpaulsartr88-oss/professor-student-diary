import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './', // Essential for GitHub Pages static deployment
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-v9-[hash].js`,
        chunkFileNames: `assets/[name]-v9-[hash].js`,
        assetFileNames: `assets/[name]-v9-[hash].[ext]`,
      },
    },
  },
})

