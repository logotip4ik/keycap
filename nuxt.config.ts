import browserslistToEsbuild from 'browserslist-to-esbuild';

import breakpoints from './assets/constants/breakpoints';

const TWO_DAYS_IN_SECONDS = 60 * 60 * 24 * 2;
const TWO_DAYS_CACHE = `private, immutable, max-age=${TWO_DAYS_IN_SECONDS}`;

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig(() => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    app: {
      head: {
        htmlAttrs: { translate: 'no' },
        title: 'Keycap',
        meta: [{ name: 'description', content: 'Better notes ❤. Synced between your devices' }],
      },
    },

    routeRules: {
      '/': { prerender: true, headers: { 'Cache-Control': TWO_DAYS_CACHE } },
      '/about': { prerender: true, headers: { 'Cache-Control': TWO_DAYS_CACHE } },
      '/login': { static: true, headers: { 'Cache-Control': TWO_DAYS_CACHE } },
      '/register': { static: true, headers: { 'Cache-Control': TWO_DAYS_CACHE } },

      '/api/**': { cors: true, cache: false },
      '/_nuxt/**': { headers: { 'Cache-Control': TWO_DAYS_CACHE } },
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
      'nuxt-security',
    ],

    css: [
      'normalize.css',
      '~/assets/styles/global.scss',
      '~/assets/fonts/Mona-Sans/style.css',
    ],

    sourcemap: isDev,

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

    security: {
      // @see https://github.com/Baroshem/nuxt-security/issues/42#issuecomment-1311727911
      hidePoweredBy: false,
      enabled: !isDev,
    },
  };
});
