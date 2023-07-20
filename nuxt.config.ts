import { isDevelopment, provider } from 'std-env';
import UnheadVite from '@unhead/addons/vite';
import SvgLoadedPlugin from 'vite-svg-loader';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import parseDuration from 'parse-duration';

import { getHeaders } from './headers.config';
import breakpoints from './constants/breakpoints';
import { ParseDurationTransformPlugin } from './vite/transform-parse-duration';

const ISRDuration = parseDuration('15 minutes', 'second');

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { translate: 'no', lang: 'en' },
      meta: [
        { name: 'description', content: 'Better then just notes. Synced between your devices' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { key: 'theme-color-light', name: 'theme-color', content: '#f2f1f3', media: '(prefers-color-scheme: light)' },
        { key: 'theme-color-dark', name: 'theme-color', content: '#1b1a1e', media: '(prefers-color-scheme: dark)' },
        { key: 'status-bar-light', name: 'apple-mobile-web-app-status-bar-style', content: 'default', media: '(prefers-color-scheme: light)' },
        { key: 'status-bar-dark', name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent', media: '(prefers-color-scheme: dark)' },
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
  },

  typescript: {
    tsConfig: {
      exclude: ['../data', '../benchmarks'],
    },
  },

  imports: {
    imports: [
      { from: 'rad-event-listener', name: 'on' },
      { from: '~/constants/index.ts', name: 'blankNoteName' },
    ],
  },

  nitro: {
    imports: {
      dirs: ['./prisma'],
    },

    typescript: {
      tsConfig: {
        compilerOptions: {
          allowSyntheticDefaultImports: true,
        },
      },
    },
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
      isr: ISRDuration,
      headers: getHeaders({
        type: 'note-view',
        opts: { isr: ISRDuration },
      }),
    },

    '/site.webmanifest': { headers: getHeaders('webmanifest') },

    '/': { prerender: true },
    '/about': { prerender: true },

    '/oauth/ask-username': { experimentalNoScripts: true },
  },

  modules: [
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
    plugins: [
      UnheadVite(),
      SvgLoadedPlugin(),
      ParseDurationTransformPlugin(),
    ],

    build: {
      target: 'esnext',
      // cssMinify: 'lightningcss',
      cssTarget: browserslistToEsbuild(),
      ...(provider === 'vercel'
        ? {
            minify: 'terser',
            terserOptions: {
              compress: true,
              mangle: true,
              safari10: false,
              ecma: 2020,
            },
          }
        : {}),
    },

    optimizeDeps: {
      include: [
        '@superhuman/command-score',
        'idb-keyval',
        'comlink',
        'workbox-core',
        'workbox-routing',
        'workbox-strategies',
        'workbox-precaching',
        'workbox-window',
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

  postcss: {
    plugins: {
      'postcss-preset-env': {
        features: {
          'custom-properties': false,
          'is-pseudo-class': false,
          'clamp': false,
          'focus-visible-pseudo-class': false,
          'focus-within-pseudo-class': false,
          'gap-properties': false,
          'prefers-color-scheme-query': false,
        },
      },
    },
  },

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
