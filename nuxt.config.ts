import browserslistToEsbuild from 'browserslist-to-esbuild';

import breakpoints from './assets/constants/breakpoints';

const TWO_DAYS_IN_SECONDS = 60 * 60 * 24 * 2;
const TWO_DAYS_CACHE = `private, immutable, max-age=${TWO_DAYS_IN_SECONDS}`;

const defaultHeaders = {
  'Cache-Control': TWO_DAYS_CACHE,
  'Access-Control-Allow-Origin': process.env.SITE_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, PUT, POST, DELETE',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': 'default-src \'self\'; connect-src https: \'self\'; script-src \'unsafe-inline\' \'self\'; script-src-elem \'unsafe-inline\' \'self\'; style-src \'unsafe-inline\' \'self\'; upgrade-insecure-requests',
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { translate: 'no' },
      title: 'Keycap',
      meta: [{ name: 'description', content: 'Better notes ❤. Synced between your devices' }],
    },
  },

  routeRules: {
    '/**': {
      headers: {
        ...(process.env.NODE_ENV === 'production' ? defaultHeaders : {}),
      },
    },
    '/about': { prerender: true },

    '/api/**': { headers: { 'Cache-Control': 'no-cache' } },
  },

  runtimeConfig: {
    public: {
      authCookiePrefix: 'auth',
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/device',
    'nuxt-icon',
    '@nuxtjs/fontaine',
  ],

  css: [
    'normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
  ],

  sourcemap: process.env.NODE_ENV === 'development',

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
  },

  device: {
    refreshOnResize: true,
  },
});
