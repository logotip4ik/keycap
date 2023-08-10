import { defineVitestConfig } from 'nuxt-vitest/config';

export default defineVitestConfig({
  test: {
    globalSetup: ['./server/setup.nitro.ts'],
  },
});
