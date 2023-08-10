import { defineVitestConfig } from 'nuxt-vitest/config';

export default defineVitestConfig({
  test: {
    setupFiles: ['./server/setup.nitro.ts'],
  },
});
