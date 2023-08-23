import UnheadVite from '@unhead/addons/vite';
import parseDuration from 'parse-duration';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { resolve } from 'pathe';
import { isCI, isDevelopment } from 'std-env';

import { getHeaders } from './headers.config';
import breakpoints from './constants/breakpoints';
import { ParseDurationTransformPlugin } from './vite/transform-parse-duration';

const tsExcludes = ['../data', '../benchmarks', '../scripts'];

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, interactive-widget=resizes-visual',
      htmlAttrs: { translate: 'no', lang: 'en' },
      meta: [
        { name: 'description', content: 'Better then just notes ❤. Synced between your devices, simple, fast and purple.' },
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
    writeEarlyHints: true,
    componentIslands: true,
    watcher: 'parcel',
    typescriptBundlerResolution: true,
  },

  typescript: {
    tsConfig: {
      exclude: tsExcludes,
      compilerOptions: {
        types: ['vitest/importMeta'],
      },
    },
  },

  imports: {
    dirs: [
      './constants',
    ],
    imports: [
      { from: 'rad-event-listener', name: 'on' },
      { from: 'perfect-debounce', name: 'debounce' },
    ],
  },

  runtimeConfig: {
    public: {
      siteOrigin: '',

      oauthEnabled: false,
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

    // this would be great https://github.com/unjs/nitro/issues/603#issuecomment-1415826732
    '/view/**': {
      isr: parseDuration('15 minutes', 'second'),
      headers: getHeaders({
        type: 'note-view',
        opts: { isr: parseDuration('15 minutes', 'second') },
      }),
    },

    '/site.webmanifest': { headers: getHeaders('webmanifest') },

    '/': { prerender: true },
    '/about': { prerender: true },

    '/oauth/ask-username': { experimentalNoScripts: true },
  },

  modules: [
    'nuxt-vitest',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/fontaine',
    'unplugin-ltsdi/nuxt',
  ],

  css: [
    'normalize.css/normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
  ],

  sourcemap: isDevelopment,

  build: {
    transpile: ['tinykeys'],
  },

  vite: {
    define: {
      'import.meta.vitest': 'undefined',
    },

    test: {
      includeSource: [
        'server/**/*.{js,ts}',
        'utils/**/*.{js,ts}',
      ],
    },

    plugins: [
      UnheadVite(),
      ParseDurationTransformPlugin(),
    ],

    build: {
      target: 'esnext',
      cssMinify: 'lightningcss',
      cssTarget: browserslistToEsbuild(),
      minify: isCI ? 'terser' : 'esbuild',
      terserOptions: !isCI ? undefined : { // eslint-disable-line multiline-ternary
        compress: true,
        mangle: true,
        safari10: false,
        ecma: 2020,
      },
    },

    optimizeDeps: {
      include: [
        '@superhuman/command-score',
        'perfect-debounce',
      ],
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            Object.entries(breakpoints).map(([key, value]) => `$breakpoint-${key}: ${value}px;`).join('\n'),
          ].join('\n'),
        },
      },
    },
  },

  nitro: {
    imports: {
      dirs: ['./prisma'],
    },

    typescript: {
      tsConfig: {
        compilerOptions: {
          allowSyntheticDefaultImports: true,
          types: ['vitest/importMeta'],
        },
        exclude: tsExcludes,
      },
    },

    esbuild: {
      options: {
        target: 'esnext',
      },
    },

    storage: {
      cache: {
        driver: 'redis',
        url: process.env.REDIS_URL,
        tls: true,
      },
    },
  },

  postcss: {
    plugins: {
      'postcss-combine-media-query': {},
    },
  },

  fontMetrics: {
    fonts: [
      {
        family: 'Mona Sans',
        src: '/fonts/Mona-Sans/Mona-Sans.woff2',
        root: 'assets',
        fallbacks: ['Arial'],
      },
    ],
  },

  serverHandlers: [
    {
      route: '/security.txt',
      handler: resolve('./server/routes/.well-known/security.txt.get.ts'),
      lazy: true,
    },
  ],

  pwa: {
    srcDir: 'workers',
    filename: 'sw.ts',
    registerType: 'prompt',
    strategies: 'injectManifest',
    manifest: false,
    includeManifestIcons: false,
    minify: true,

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
});
