import parseDuration from 'parse-duration';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { join, resolve } from 'pathe';
import { isCI, isDevelopment, isProduction, nodeENV } from 'std-env';
import RollupSucrase from '@rollup/plugin-sucrase';
import RollupUrl from '@rollup/plugin-url';

import { prefixedConfig } from './config/build';
import { getHeaders } from './config/headers';
import { tsConfig } from './config/typescript';
import { breakpoints, sidebarsBreakpoints } from './constants/breakpoints';
import { inlinableStylesRE, nodeModulesRE } from './constants/build';
import { ParseDurationTransformPlugin, parseDurationFunctionName } from './unplugin/parse-duration';

export default defineNuxtConfig({
  compatibilityDate: '2024-07-06',

  devtools: { enabled: true },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, interactive-widget=resizes-visual',
      htmlAttrs: { translate: 'no', lang: 'en' },
      meta: [
        { name: 'description', content: 'Better then notes ❤️. Synced between your devices, simple, fast, shareable and purple.' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#FCFCFD', media: '(prefers-color-scheme: light)', key: 'theme-color-light' },
        { name: 'theme-color', content: '#111113', media: '(prefers-color-scheme: dark)', key: 'theme-color-dark' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default', media: '(prefers-color-scheme: light)', key: 'status-bar-light' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent', media: '(prefers-color-scheme: dark)', key: 'status-bar-dark' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'robots', content: 'none' },
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest', crossorigin: 'use-credentials' },
      ],
    },
  },

  experimental: {
    watcher: 'parcel',
    headNext: true,
    componentIslands: 'local',
  },

  future: {
    compatibilityVersion: 4,
    typescriptBundlerResolution: true,
  },

  features: {
    inlineStyles: (id) => {
      if (!id || nodeModulesRE.test(id)) {
        return false;
      }

      return inlinableStylesRE.some((re) => re.test(id));
    },
  },

  typescript: { tsConfig },

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
        from: resolve('./types/toasts.d.ts'),
        imports: [
          'ToastType',
          'ToastButton',
          'ToastInstance',
        ],
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
      resolve('./constants'),
      resolve('./composables/tiptap'),
    ],

    imports: [
      {
        from: 'parse-duration',
        name: 'default',
        as: parseDurationFunctionName,
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

      turnstile: {
        siteKey: '',
      },

      features: {},

      errors: {
        url: '',
        apiKey: '',
      },
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
  },

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

    '/og/**': { headers: getHeaders('og') },

    '/site.webmanifest': { headers: getHeaders('webmanifest') },

    // this would be great https://github.com/unjs/nitro/issues/603#issuecomment-1415826732
    '/view/**': { isr: parseDuration('15 minutes', 'second') },

    '/oauth/ask-username': { experimentalNoScripts: true },
  },

  modules: [
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/fontaine',
  ],

  css: [
    'normalize.css/normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
    '~/assets/styles/with-blob.scss',
  ],

  sourcemap: isDevelopment,

  build: {
    transpile: ['tinykeys'],
  },

  hooks: {
    'nitro:init': function (nitro) {
      nitro.options.devStorage.root.ignore.push(
        '**/data/**',
        '**/.nuxt/**',
        '**/benchmarks/**',
        '**/.github/**',
        '**/.vercel/**',
        '**/.output/**',
        '**/.vscode/**',
        '**/.yarn/**',
        '**/polyfills/**',
        '**/scripts/**',
        '**/server/**',
        '**/unplugin/**',
      );

      if (isDevelopment) {
        return;
      }

      delete nitro.options.storage.data;

      // minifies service worker
      const terserPromise = import('terser');
      const fspPromise = import('node:fs/promises');

      nitro.hooks.hookOnce('compiled', async (nitro) => {
        const terser = await terserPromise;
        const fsp = await fspPromise;

        const { publicDir } = nitro.options.output;

        const swPath = join(publicDir, 'sw.js');
        const swSource = await fsp.readFile(swPath, 'utf8');
        const swMinified = await terser.minify(swSource, {
          compress: true,
          mangle: true,
          ecma: 2020,
          sourceMap: false,
          ie8: false,
          safari10: false,
        });

        await fsp.writeFile(swPath, swMinified.code!);
      });
    },
  },

  vite: {
    define: {
      'import.meta.dev': isDevelopment,
      'import.meta.prod': isProduction,

      '__VUE_OPTIONS_API__': false,

      'process.env.NODE_ENV': JSON.stringify(nodeENV),

      ...prefixedConfig,
    },

    build: {
      cssMinify: 'lightningcss',
      cssTarget: browserslistToEsbuild(),
      target: 'esnext',
      minify: isCI ? 'terser' : 'esbuild',
      terserOptions: isCI ? { // eslint-disable-line style/multiline-ternary
        compress: true,
        mangle: true,
        safari10: false,
        ecma: 2020,
      } : undefined,

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
          additionalData: [
            Object.entries(breakpoints).map(([key, value]) => `$breakpoint-${key}: ${value}px;`).join('\n'),
            Object.entries(sidebarsBreakpoints).map(([key, value]) => `$sidebar-breakpoint-${key}: ${value}px;`).join('\n'),
          ].join('\n'),
        },
      },
    },

    $client: {
      build: {
        rollupOptions: {
          external: ['.prisma/client/index-browser'],
        },
      },

      optimizeDeps: {
        include: [
          '@superhuman/command-score',
          'parse-duration',
          'hashlru',
          'idb-keyval',
          'rad-event-listener',
          'cookie-es',
        ],

        // https://github.com/antfu/nuxt-better-optimize-deps
        exclude: [
          // Vue
          'vue',
          '@vue/runtime-core',
          '@vue/runtime-dom',
          '@vue/reactivity',
          '@vue/shared',
          '@vue/devtools-api',
          'vue-router',
          'vue-demi',

          // Nuxt Deps
          'pathe',
          'unenv',
          'klona',
          'devalue',
          'hookable',
          'unctx',
          'h3',
          'defu',
          'ofetch',
          'ufo',
          '@unhead/vue',

          // Ecosystem - later they should be providede by the ecosystem module
          '@vueuse/core',
          '@vueuse/shared',
        ],
      },
    },

    $server: {
      // https://github.com/antfu/nuxt-better-optimize-deps
      optimizeDeps: {
        noDiscovery: true,
      },

      plugins: [
        // Taken from elk
        // https://github.com/elk-zone/elk/blob/ed5592260fc83f0207a12a7184973749e87bc85e/nuxt.config.ts#L186
        {
          name: 'mock',
          enforce: 'pre',
          resolveId(id) {
            if (/(?:^|\/)@tiptap\//.test(id)) {
              return resolve('./mocks/tiptap.ts');
            }
            if (/(?:^|\/)prosemirror/.test(id)) {
              return resolve('./mocks/prosemirror.ts');
            }
          },
        },
      ],
    },
  },

  nitro: {
    replace: {
      // https://github.com/danielroe/roe.dev/blob/main/nuxt.config.ts#L115
      'process.browser': false,

      'import.meta.dev': isDevelopment,
      'import.meta.prod': isProduction,

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
          ],
          fileName: isProduction ? '[name][extname]' : '[dirname][name][extname]',
          sourceDir: isDevelopment ? process.cwd() : undefined,
        }),
      ],
    },

    imports: {
      presets: [
        {
          from: resolve('./utils/keys.ts'),
          imports: ['createKey', 'KeyPrefix'],
        },
        {
          from: resolve('./kysely/kysely.ts'),
          imports: ['getKysely'],
        },
      ],

      dirs: [
        resolve('./prisma'),
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
      ],
    },

    typescript: { tsConfig },

    esbuild: {
      options: {
        target: 'esnext',
      },
    },

    storage: isCI ? { // eslint-disable-line style/multiline-ternary
      cache: {
        driver: 'redis',
        url: process.env.REDIS_URL,
        tls: true,
      },
    } : undefined,
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
        src: 'fonts/Mona-Sans/Mona-Sans.woff2',
        root: 'assets',
        fallbacks: ['Arial'],
      },
    ],
  },

  pwa: {
    srcDir: 'workers',
    filename: 'sw.ts',
    registerType: 'prompt',
    strategies: 'injectManifest',
    manifest: false,
    includeManifestIcons: false,
    minify: true, // TODO: why this is not working ? https://github.com/vite-pwa/nuxt/issues/62

    client: {
      installPrompt: false,
      registerPlugin: true,
      periodicSyncForUpdates: parseDuration('1 hour', 'second'),
    },

    injectManifest: {
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
      globIgnores: ['**.webmanifest', 'register', 'login', 'sw.js', 'index.html'],
    },
  },

  $production: {
    vite: {
      define: {
        'import.meta.vitest': false,
      },

      plugins: [
        ParseDurationTransformPlugin.vite(),
      ],
    },

    nitro: {
      minify: isCI,

      replace: {
        'import.meta.vitest': false,
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
