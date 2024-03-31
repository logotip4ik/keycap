import antfu from '@antfu/eslint-config';
import * as regexp from 'eslint-plugin-regexp';

export default antfu({
  stylistic: {
    quotes: 'single',
    overrides: {
      curly: ['error', 'all'],
    },
  },

  rules: {
    'style/semi': ['error', 'always'],
    'style/arrow-parens': ['error', 'always'],
    'ts/array-type': ['error', { default: 'generic' }],
    'ts/no-shadow': 'off',

    'import/no-nodejs-modules': 'off',
    'yaml/no-empty-mapping-value': 'off',
    'node/prefer-global/process': ['error', 'always'],
  },
}, {
  ...regexp.configs.recommended,
  plugins: { regexp },
}, {
  rules: {
    'no-restricted-syntax': [
      'error',
      // Antfu default
      'DebuggerStatement',
      'LabeledStatement',
      'WithStatement',
      'TSEnumDeclaration[const=true]',
      'TSExportAssignment',

      // Do not allow emit
      {
        message: 'use props instead.',
        selector: '[name=defineEmits]',
      },
    ],
  },
}, {
  ignores: [
    'data',
    'node_modules',
    '.nuxt',
    '.output',
    '.vscode',
    '.yarn/',
    'archive',
    'prisma/migrations',
    'kysely/db',
    'public',
    'docker-compose.*',
    'package.json',
    '*.lock',
    'tsconfig.json',
    'vercel.json',
    'dist',
    'benchmarks',
  ],
});
