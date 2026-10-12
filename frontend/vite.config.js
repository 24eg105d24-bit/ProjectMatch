import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    // Use jsdom to simulate a browser DOM environment
    environment: 'jsdom',

    // Make describe/it/expect/vi available globally (no per-file imports needed)
    globals: true,

    // Load jest-dom matchers before every test file
    setupFiles: ['./src/test/setup.js'],

    // Skip CSS processing — faster and avoids parse errors from Bootstrap variables
    css: false,
  },
})
