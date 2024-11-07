import RollupSucrase from '@rollup/plugin-sucrase';
import RollupUrl from '@rollup/plugin-url';
import UnheadVite from '@unhead/addons/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defu } from 'defu';
import parseDuration from 'parse-duration';
import { resolve } from 'pathe';
import { isCI, isDevelopment, isProduction, nodeENV } from 'std-env';

import { prefixedConfig } from './config/build';
import { getHeaders } from './config/headers';
import { tsConfig } from './config/typescript';
import { breakpoints, sidebarsBreakpoints } from './constants/breakpoints';
import { inlinableStylesRE } from './constants/build';
import { parseDurationFunctionName, ParseDurationTransformPlugin } from './unplugin/parse-duration';

export default defineNuxtConfig({
  compatibilityDate: '2024-07-06',

  devtools: { enabled: true },

  rootDir: resolve('./'),
  srcDir: resolve('./app'),
  serverDir: resolve('./server'),

  app: {
    head: {
      title: 'Keycap',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { translate: 'no', lang: 'en' },
      meta: [
        { name: 'description', content: 'Beautiful Notes 💜. Fast, simple, shareable, synced between devices and purple.' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { property: 'og:site_name', content: 'Keycap' },
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest', crossorigin: 'use-credentials' },
      ],
    },
  },

  alias: {
    '#app': resolve('./app'),
    // only used by tsc
    '#server': resolve('./server'),
  },

  experimental: {
    watcher: 'parcel',
    headNext: true,
    componentIslands: 'local',
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: {
          interaction: true,
          visibility: false,
        },
      },
    },
  },

  future: {
    compatibilityVersion: 4,
    typescriptBundlerResolution: true,
  },

  features: {
    inlineStyles: (id) => {
      if (!id) {
        return false;
      }

      return inlinableStylesRE.some((re) => re.test(id));
    },
  },

  typescript: {
    tsConfig: defu(tsConfig, {
      include: ['../app/types/*'],
    }),
  },

  imports: {
    presets: [
      {
        from: '@vue/shared',
        imports: [
          'NOOP',
          'invokeArrayFns',
          'isArray',
          'extend',
          'remove',
        ],
      },
      {
        type: true,
        from: resolve('./app/types/toasts.d.ts'),
        imports: [
          'ToastType',
          'ToastButton',
          'ToastInstance',
        ],
      },
      {
        from: resolve('./app/types/common'),
        imports: ['ItemState'],
      },
      {
        from: 'rad-event-listener',
        imports: ['on'],
      },
      {
        from: 'perfect-debounce',
        imports: ['debounce'],
      },
    ],

    dirs: [
      resolve('./shared'),
      resolve('./constants'),
      resolve('./app/composables/tiptap'),
    ],

    imports: [
      {
        from: 'parse-duration',
        name: 'default',
        as: parseDurationFunctionName,
      },
      {
        from: 'tiny-invariant',
        name: 'default',
        as: 'invariant',
      },
    ],
  },

  ignore: [
    '**/data/**',
    '**/benchmarks/**',
    '**/.github/**',
    '**/.vercel/**',
    '**/.output/**',
    '**/.vscode/**',
    '**/.yarn/**',
    '**/polyfills/**',
    '**/scripts/**',
    '**/unplugin/**',
  ],

  runtimeConfig: {
    public: {
      site: '',
      zeenkSite: '',

      turnstile: {
        siteKey: '',
      },

      features: {},
    },

    turnstile: {
      secret: '',
      endpoint: 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    },

    github: {
      clientId: '',
      clientSecret: '',
    },

    google: {
      clientId: '',
      clientSecret: '',
    },

    axiom: {
      token: '',
      orgId: '',
      dataset: '',
      baseUrl: 'https://api.axiom.co',
    },

    resend: {
      apiKey: '',
      site: '',
      endpoint: 'https://api.resend.com/emails',
    },
  },

  // nitro doesn't apply route rules for dev server, so cmd+k search will be broken for firefox+dev
  routeRules: {
    '/**': { headers: getHeaders('default') },

    // Caching only build assets that has build hash in filenames
    // Actually nuxt caches assets for 1 year by default
    // https://github.com/nuxt/nuxt/blob/7cb4c69935ba0de874ba3274c42fc1df8bbca3ed/packages/nuxt/src/core/nitro.ts#L102
    // this setup uses only 6 months and adds another 6 months for stale-while-revalidate cache
    '/_nuxt/**': { headers: getHeaders('assets') },

    '/api/**': { headers: getHeaders('api') },
    '/api/info': {
      // To correctly render response endpoint needs query, but nitro lacks
      // possibility to pass vercel specific options to isr yet.
      // isr: true
      headers: getHeaders('api-info'),
    },

    // this would be great https://github.com/unjs/nitro/issues/603#issuecomment-1415826732
    '/view/**': { isr: parseDuration('15 minutes', 'second') },
    '/og/**': { headers: getHeaders('og') },
    '/fonts/**': { headers: getHeaders('fonts') },
    '/editor-wide.webp': { headers: getHeaders('editor-images') },
    '/editor-wide-dark.webp': { headers: getHeaders('editor-images') },
    '/site.webmanifest': { headers: getHeaders('webmanifest') },

    '/oauth/ask-username': { experimentalNoScripts: true },
  },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/fontaine',
  ],

  css: [
    'normalize.css/normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
  ],

  sourcemap: !isCI,

  build: {
    transpile: ['tinykeys'],
  },

  vite: {
    define: {
      'import.meta.dev': isDevelopment,
      'import.meta.prod': isProduction,
      'import.meta.ci': isCI,

      'process.env.NODE_ENV': JSON.stringify(nodeENV),

      ...prefixedConfig,
    },

    vue: {
      features: {
        optionsAPI: false,
      },
    },

    json: {
      stringify: true,
    },

    build: {
      target: 'esnext',

      cssMinify: 'lightningcss',
      cssTarget: browserslistToEsbuild('>0.3%, not dead, Safari > 15, iOS > 15'),

      rollupOptions: {
        treeshake: 'recommended',
        output: {
          generatedCode: 'es2015',
        },
      },
    },

    worker: {
      format: 'es',
      rollupOptions: {
        treeshake: 'recommended',
        output: {
          generatedCode: 'es2015',
        },
      },
    },

    css: {
      preprocessorMaxWorkers: true,
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: [
            '@use "sass:math";',
            Object.entries(breakpoints).map(([key, value]) => `$breakpoint-${key}: ${value}px;`).join('\n'),
            Object.entries(sidebarsBreakpoints).map(([key, value]) => `$sidebar-breakpoint-${key}: ${value}px;`).join('\n'),
          ].join('\n'),
        },
      },
    },

    optimizeDeps: {
      include: [
        'mitt',
        'coincident/main',
        'coincident/worker',
        'idb-keyval',
        'perfect-debounce',
        'cookie-es',
        'escape-string-regexp',
        '@floating-ui/dom',
        '@superhuman/command-score',
      ],

      exclude: [
        '@tiptap/core',
        '@tiptap/extension-blockquote',
        '@tiptap/extension-bold',
        '@tiptap/extension-bullet-list',
        '@tiptap/extension-code',
        '@tiptap/extension-code-block',
        '@tiptap/extension-document',
        '@tiptap/extension-hard-break',
        '@tiptap/extension-heading',
        '@tiptap/extension-highlight',
        '@tiptap/extension-history',
        '@tiptap/extension-horizontal-rule',
        '@tiptap/extension-italic',
        '@tiptap/extension-list-item',
        '@tiptap/extension-ordered-list',
        '@tiptap/extension-paragraph',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-strike',
        '@tiptap/extension-task-item',
        '@tiptap/extension-task-list',
        '@tiptap/extension-text',
        '@tiptap/extension-text-align',
        '@tiptap/extension-text-style',
        '@tiptap/pm',
        '@tiptap/suggestion',
        '@tiptap/vue-3',
      ],

      esbuildOptions: {
        target: 'esnext',
      },
    },

    $server: {
      plugins: [
        // Taken from elk
        // https://github.com/elk-zone/elk/blob/ed5592260fc83f0207a12a7184973749e87bc85e/nuxt.config.ts#L186
        {
          name: 'mock',
          enforce: 'pre',
          resolveId(id) {
            if (/(?:^|\/)@?tiptap\//.test(id)) {
              return resolve('./app/mocks/tiptap.ts');
            }
            if (/(?:^|\/)prosemirror/.test(id)) {
              return resolve('./app/mocks/prosemirror.ts');
            }
          },
        },
      ],
    },
  },

  nitro: {
    rootDir: resolve('./'),
    srcDir: resolve('./server'),

    alias: {
      '#server': resolve('./server'),
    },

    replace: {
      'import.meta.dev': isDevelopment,
      'import.meta.prod': isProduction,
      'import.meta.ci': isCI,

      'process.env.NODE_ENV': JSON.stringify(nodeENV),

      ...prefixedConfig,
    },

    rollupConfig: {
      treeshake: 'recommended',
      output: {
        generatedCode: 'es2015',
      },
      // @ts-expect-error broken types
      plugins: [
        RollupUrl({
          limit: 0,
          include: [
            '**/*.ttf',
            '**/*.svg',
            '**/*.html',
          ],
          destDir: `${process.cwd()}/.output`,
          sourceDir: isDevelopment ? process.cwd() : undefined,
          fileName: isDevelopment ? '[dirname][name][extname]' : '[hash][extname]',
        }),
      ],
    },

    imports: {
      presets: [
        {
          from: resolve('./kysely/kysely.ts'),
          imports: ['getKysely'],
        },
      ],

      dirs: [
        resolve('./shared'),
      ],

      imports: [
        {
          from: 'parse-duration',
          name: 'default',
          as: parseDurationFunctionName,
        },
        {
          from: '@drdgvhbh/postgres-error-codes',
          name: '*',
          as: 'PostgresErrorCode',
        },
        {
          from: 'tiny-invariant',
          name: 'default',
          as: 'invariant',
        },
      ],
    },

    typescript: {
      tsConfig: defu(tsConfig, {
        include: ['../server/types/*'],
      }),
    },

    esbuild: {
      options: {
        target: 'esnext',
      },
    },

    storage: {
      cache: isCI ? { // eslint-disable-line style/multiline-ternary
        driver: 'redis',
        url: process.env.REDIS_URL,
        tls: true,
      } : undefined,

      keycap: {
        driver: 'redis',
        url: process.env.REDIS_URL,
        tls: true,
      },
    },

    devStorage: {
      keycap: {
        driver: 'memory',
      },
    },
  },

  serverHandlers: [
    {
      route: '/security.txt',
      handler: resolve('./server/routes/.well-known/security.txt.get.ts'),
      lazy: true,
      method: 'get',
      middleware: false,
    },
    {
      route: '/api/folder',
      handler: resolve('./server/api/folder/[...path].get.ts'),
      lazy: true,
      method: 'get',
      middleware: false,
    },
  ],

  fontMetrics: {
    fonts: [
      {
        family: 'Mona Sans',
        src: 'fonts/Mona-Sans.woff2',
        fallbacks: ['Arial'],
      },
    ],
  },

  pwa: {
    disable: !isCI,
    srcDir: 'workers',
    filename: 'sw.ts',
    registerType: 'prompt',
    strategies: 'injectManifest',
    manifest: false,
    includeManifestIcons: false,
    minify: true,

    pwaAssets: {
      disabled: true,
    },

    client: {
      installPrompt: false,
      registerPlugin: true,
      periodicSyncForUpdates: parseDuration('1 hour', 'second'),
    },

    injectManifest: {
      globPatterns: ['**/*.{js,json,css,html,svg,ico,woff2}', 'logo.webp'],
      globIgnores: [
        '**.webmanifest',
        '*-dev*',
        'index.html',
      ],
    },
  },

  $production: {
    vite: {
      define: {
        'import.meta.vitest': false,
      },

      plugins: [
        ParseDurationTransformPlugin.vite(),
        UnheadVite(),
      ],
    },

    nitro: {
      minify: isCI,

      replace: {
        'import.meta.vitest': false,
      },

      externals: {
        external: ['crossws', 'croner', 'iron-webcrypto'],
      },

      rollupConfig: {
        plugins: [
          // NOTE: it results in smaller server size and faster builds. Neat ¯\_(ツ)_/¯
          RollupSucrase({
            disableESTransforms: true,
            transforms: [
              'typescript',
            ],
          }),
          ParseDurationTransformPlugin.rollup(),
        ],
      },
    },
  },
});
