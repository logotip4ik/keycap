import { defineVitestConfig as defineConfig } from 'nuxt-vitest/config';

export default defineConfig({
  // @ts-expect-error just following the docs and it works ?
  test: {
    setupFiles: ['./server/setup.nitro.ts'],

    includeSource: [
      'server/**/*.{js,ts}',
      'utils/**/*.{js,ts}',
    ],
  },
});
