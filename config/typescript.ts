import type { TSConfig } from 'pkg-types';

export const tsConfig: TSConfig = {
  compilerOptions: {
    types: ['vitest/importMeta'],
    moduleDetection: 'force',
    isolatedModules: true, // disabled in nitro ?
    noUncheckedIndexedAccess: false,
    useDefineForClassFields: true,
  },

  exclude: [
    '../data',
    '../benchmarks',
    '../scripts',
    '../.github',
    '../.vercel',
    '../.output',
    '../.vscode',
    '../.yarn',
    '../eslint.config.js',
    '../archive',
    '../prisma/migrations',
    '../public',

    // this folder has it's own tsconfig
    '../workers',
  ],
};
