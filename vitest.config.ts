import { defineVitestConfig as defineConfig } from 'nuxt-vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./server/setup.nitro.ts'],

    includeSource: [
      'server/**/*.{js,ts}',
      'utils/**/*.{js,ts}',
    ],
  },
});
