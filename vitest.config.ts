import { defaultExclude } from 'vitest/config';
import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    isolate: false,

    setupFiles: ['./server/test/stub-nitro.ts'],

    includeSource: [
      'server/**/*.ts',
      'utils/**/*.ts',
    ],

    exclude: [
      ...defaultExclude,
      '**/data/**',
    ],
  },
});
