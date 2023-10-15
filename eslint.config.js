import antfu from '@antfu/eslint-config';
import * as regexp from 'eslint-plugin-regexp';

const ignores = [
  'data',
  'node_modules',
  '.nuxt',
  '.output',
  '.vscode',
  '.yarn/',
  'archive',
  'prisma/migrations',
  'public',
  'docker-compose.*',
  'package.json',
  '*.lock',
  'tsconfig.json',
  'vercel.json',
  'dist',
  'benchmarks',
];

export default antfu({
  stylistic: {
    quotes: 'single',
  },

  rules: {
    'style/semi': ['error', 'always'],
    'ts/array-type': ['error', { default: 'generic' }],
    'ts/no-shadow': 'off',

    'arrow-parens': ['error', 'always'],
    'curly': ['error', 'multi-or-nest', 'consistent'],
    'antfu/if-newline': 'off',
    'import/no-nodejs-modules': 'off',
    'yaml/no-empty-mapping-value': 'off',
    'node/prefer-global/process': ['error', 'always'],
  },
}, {
  ...regexp.configs.recommended,
  plugins: { regexp },
}, {
  ignores,
});
