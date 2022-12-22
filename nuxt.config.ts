// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      authCookiePrefix: 'auth',
    },
  },

  modules: ['@vueuse/nuxt', 'nuxt-icon'],

  css: [
    'normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
  ],

  nitro: {
    preset: 'vercel',
  },
});
