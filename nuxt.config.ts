import { isDevelopment } from 'std-env';

import { getHeaders } from './headers.config';
import breakpoints from './assets/constants/breakpoints';

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

  experimental: {
    writeEarlyHints: true,
  },

  typescript: {
    tsConfig: {
      exclude: ['../data'],
    },
  },

  routeRules: {
    '/**': { headers: getHeaders('default') },

    // Caching only build assets that has build hash in filenames
    '/_nuxt/**': { headers: getHeaders('assets') },

    '/api/**': { headers: getHeaders('api') },

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
  ],

  css: [
    'normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
  ],

  sourcemap: isDevelopment,

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
  },

  fontMetrics: {
    fonts: [
      // src is relative to public folder
      { family: 'Mona Sans', src: '/fonts/Mona-Sans.woff2' },
    ],
  },
});
