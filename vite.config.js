import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // You can add more Vitest-specific options here if needed
    globals: true, // This makes `describe`, `it`, `expect` available globally
    environment: 'jsdom', // If you need DOM APIs for testing, otherwise remove
  },
});