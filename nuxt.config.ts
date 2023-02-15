import LTSDI from 'unplugin-ltsdi/vite';
import { isProduction } from 'std-env';

import breakpoints from './assets/constants/breakpoints';

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const SIX_MONTH_IN_SECONDS = 60 * 60 * 24 * 31 * 6;

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.SITE_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, PATCH, POST, DELETE',
  'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
};

const cspHeaders = {
  'Content-Security-Policy': [
    'default-src \'self\';',
    'connect-src https: \'self\';',
    'script-src \'unsafe-inline\' \'self\';',
    'script-src-elem \'unsafe-inline\' \'self\';',
    'style-src \'unsafe-inline\' \'self\';',
    'object-src \'none\';',
    'upgrade-insecure-requests',
  ].join(' '),
};

const longCacheHeaders = {
  'Cache-Control': `public, immutable, max-age=${WEEK_IN_SECONDS}, stale-while-revalidate=${SIX_MONTH_IN_SECONDS}`,
};

const noCacheHeaders = {
  'Cache-Control': 'private, must-revalidate, max-age=0',
};

// basically helmet defaults with some customizations
const defaultHeaders = {
  // 'Cross-Origin-Embedder-Policy': 'require-corp',
  // 'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '0',
  'Keep-Alive': '5',
  'Referrer-Policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Vary': 'Accept-Encoding, Accept, X-Requested-With',
  ...noCacheHeaders,
  ...(isProduction ? cspHeaders : {}),
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { translate: 'no', lang: 'en' },
      title: 'Keycap',
      meta: [
        { name: 'description', content: 'Better notes ❤. Synced between your devices' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#f2f1f3', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#1b1a1e', media: '(prefers-color-scheme: dark)' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default', media: '(prefers-color-scheme: light)' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest', crossorigin: 'use-credentials' },
      ],
    },
  },

  typescript: {
    tsConfig: {
      exclude: ['../data'],
    },
  },

  routeRules: {
    '/**': {
      headers: { ...defaultHeaders },
    },

    // Caching only build assets that has build hash in filenames
    '/_nuxt/**': {
      headers: {
        ...defaultHeaders,
        ...(isProduction ? longCacheHeaders : {}),
      },
    },

    '/api/**': {
      headers: {
        ...defaultHeaders,
        ...(isProduction ? corsHeaders : {}),
      },
    },

    '/': { prerender: true },
    '/about': { prerender: true },
    '/login': { prerender: true },
    '/register': { prerender: true },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/device',
    'nuxt-icon',
    '@nuxtjs/fontaine',
    'unplugin-ltsdi/nuxt',
    '~/modules/build-env',
    '~/modules/purge-comments',
  ],

  css: [
    'normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
  ],

  sourcemap: process.env.NODE_ENV === 'development',

  build: {
    transpile: ['ufo'],
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            Object.entries(breakpoints).map(([key, value]) => `$breakpoint-${key}: ${value}px;`).join('\n'),
          ].join('\n'),
        },
      },
    },

    worker: {
      plugins: [LTSDI()],
    },
  },

  device: {
    refreshOnResize: true,
  },

  fontMetrics: {
    fonts: [
      // src is relative to public folder
      { family: 'Mona Sans', src: '/fonts/Mona-Sans.woff2' },
    ],
  },
});
