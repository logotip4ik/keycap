import { defineVitestConfig } from '@nuxt/test-utils/config';
import { defaultExclude } from 'vitest/config';

export default defineVitestConfig({
  assetsInclude: ['**.html'],

  test: {
    mockReset: true,
    globals: true,

    root: './',

    poolOptions: {
      threads: {
        maxThreads: 1,
        minThreads: 1,
      },
    },

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

    exclude: [
      ...defaultExclude,
      '**/data/**',
    ],

    environmentOptions: {
      nuxt: {
        overrides: {
          imports: {
            polyfills: true,
          },
        },
      },
    },
  },
});
