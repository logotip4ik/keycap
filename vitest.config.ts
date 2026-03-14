import { defineVitestProject } from '@nuxt/test-utils/config';
import { resolve } from 'pathe';
import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'bun:test': resolve('./vitest.config.ts'),
    },
  },

  test: {
    projects: [
      {
        test: {
          name: 'e2e',
          include: ['app/tests/e2e/**/*.ts'],
          environment: 'node',
        },
      },

      await defineVitestProject({
        assetsInclude: ['**/*.html'],

        test: {
          name: 'nuxt',

          includeSource: [
            './server/**/*.ts',
            './shared/**/*.ts',
            './app/utils/*.ts',
            './app/composables/tiptap/**/*.ts',
          ],

          exclude: [
            ...defaultExclude,
            'app/tests/e2e/**',
          ],

          environment: 'nuxt',

          setupFiles: [
            './server/test/stub-nitro.ts',
            './app/tests/setup-dom-expects.ts',
          ],

        },
      }),
    ],
  },
});
