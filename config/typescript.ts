import type { TSConfig } from 'pkg-types';

export const tsConfig: TSConfig = {
  compilerOptions: {
    types: ['vitest/importMeta'],
  },

  exclude: [
    '../data',
    '../benchmarks',
    '../scripts',
    '../eslint.config.js',
  ],
};
