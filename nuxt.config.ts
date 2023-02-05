import browserslistToEsbuild from 'browserslist-to-esbuild';
import LTSDI from 'unplugin-ltsdi/vite';

import breakpoints from './assets/constants/breakpoints';

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const SIX_MONTH_IN_SECONDS = 60 * 60 * 24 * 31 * 6;
const DEFAULT_CACHE = `public, immutable, max-age=${WEEK_IN_SECONDS}, stale-while-revalidate=${SIX_MONTH_IN_SECONDS}`;
const NO_CACHE = 'private, must-revalidate, max-age=0';

const defaultHeaders = {
  'Access-Control-Allow-Origin': process.env.SITE_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, PATCH, POST, DELETE',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Keep-Alive': '5',
  'Referrer-Policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
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
  'Cache-Control': DEFAULT_CACHE,
};

const noCacheHeaders = {
  'Cache-Control': NO_CACHE,
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
        { name: 'theme-color', content: '#1b1a1e' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
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
      headers: {
        ...defaultHeaders,
        ...noCacheHeaders,
        ...(process.env.NODE_ENV === 'production' ? cspHeaders : {}),
      },
    },

    '/': { prerender: true },
    '/about': { prerender: true },
    '/login': { prerender: true },
    '/register': { prerender: true },

    // Caching only build assets that has build hash in filenames
    '/_nuxt/**': { headers: { ...(process.env.NODE_ENV === 'production' ? longCacheHeaders : {}) } },
    // Rely on browser to cache favicon
    '/favicon.ico': { headers: { 'Cache-Control': '' } },
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
    build: {
      target: browserslistToEsbuild(),
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
