import { defineVitestConfig as defineConfig } from 'nuxt-vitest/config';

export default defineConfig({
  // @ts-expect-error just following the docs and it works ?
  test: {
    setupFiles: ['./server/setup.nitro.ts'],

    includeSource: [
      'server/**/*.{js,ts}',
      'utils/**/*.{js,ts}',
    ],

    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/data/**',
    ],
  },
});
