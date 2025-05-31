import { defineVitestConfig } from '@nuxt/test-utils/config';
import { defaultExclude, defaultInclude } from 'vitest/config';

export default defineVitestConfig({
  assetsInclude: ['**.html'],

  test: {
    root: './',

    setupFiles: [
      './server/test/stub-nitro.ts',
      './tests/setup-dom-expects.ts',
    ],

    includeSource: [
      './server/**/*.ts',
      './shared/**/*.ts',
      './app/utils/*.ts',
      './app/composables/tiptap/**/*.ts',
    ],

    include: [
      ...defaultInclude,
      '**/e2e/**',
    ],

    exclude: [
      ...defaultExclude,
      '**/data/**',
    ],
  },
});
