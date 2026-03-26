import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // This maps "~/..." to the "scripts/..." folder
      '~': path.resolve(__dirname, './scripts'),
    },
  },
  test: {
    // You can add more Vitest-specific options here if needed
    globals: true, // This makes `describe`, `it`, `expect` available globally
    environment: 'jsdom', // If you need DOM APIs for testing, otherwise remove
  },
});