import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')

          if (!normalizedId.includes('node_modules')) {
            return undefined
          }

          if (
            normalizedId.includes('/@clerk/') ||
            normalizedId.includes('/@supabase/')
          ) {
            return 'auth-vendor'
          }

          if (
            normalizedId.includes('/three/') ||
            normalizedId.includes('/@react-three/')
          ) {
            return 'three-vendor'
          }

          if (
            normalizedId.includes('/framer-motion/') ||
            normalizedId.includes('/gsap/') ||
            normalizedId.includes('/lenis/')
          ) {
            return 'motion-vendor'
          }

          if (
            normalizedId.includes('/react/') ||
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/react-router-dom/') ||
            normalizedId.includes('/scheduler/')
          ) {
            return 'react-vendor'
          }

          return 'misc-vendor'
        },
      },
    },
  },
})
