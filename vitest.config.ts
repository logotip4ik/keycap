import { defineVitestConfig as defineConfig } from 'nuxt-vitest/config';

export default defineConfig({
  // @ts-expect-error probably because of vitest v0.34.0, but it still works
  test: {
    setupFiles: ['./server/setup.nitro.ts'],

    includeSource: [
      'server/**/*.{js,ts}',
      'utils/**/*.{js,ts}',
    ],
  },
});
