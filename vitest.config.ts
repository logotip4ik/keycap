import { defaultExclude } from 'vitest/config';
import { defineVitestConfig as defineConfig } from '@nuxt/test-utils/config';

export default defineConfig({
  // @ts-expect-error just following the docs and it works ?
  test: {
    setupFiles: ['./server/test/stub-nitro.ts'],

    includeSource: [
      'server/**/*.{js,ts}',
      'utils/**/*.{js,ts}',
    ],

    exclude: [
      ...defaultExclude,
      '**/data/**',
    ],
  },
});
