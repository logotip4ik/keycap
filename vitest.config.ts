import { defineVitestConfig } from '@nuxt/test-utils/config';
import { defaultExclude } from 'vitest/config';

export default defineVitestConfig({
  assetsInclude: ['**.html'],
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
