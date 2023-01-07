import browserslistToEsbuild from 'browserslist-to-esbuild';

import breakpoints from './assets/constants/breakpoints';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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

  nitro: {
    preset: 'vercel',
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
  },

  device: {
    refreshOnResize: true,
  },

  security: {
    // @see https://github.com/Baroshem/nuxt-security/issues/42#issuecomment-1311727911
    hidePoweredBy: false,
  },
});
