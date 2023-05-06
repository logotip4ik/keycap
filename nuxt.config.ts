import { isDevelopment } from 'std-env';

import { getHeaders } from './headers.config';
import breakpoints from './assets/constants/breakpoints';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
    polyfillVueUseHead: false,
    componentIslands: true,
    renderJsonPayloads: true,
    watcher: 'parcel',
  },

  typescript: {
    tsConfig: {
      exclude: ['../data'],
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
    '/view/**': { isr: 60 * 15 },

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
    'normalize.css/normalize.css',
    '~/assets/styles/global.scss',
    '~/assets/fonts/Mona-Sans/style.css',
  ],

  sourcemap: isDevelopment,

  vite: {
    build: {
      target: 'esnext',
    },

    optimizeDeps: {
      include: ['@superhuman/command-score'],
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
      // src is relative to public folder
      { family: 'Mona Sans', src: '/fonts/Mona-Sans.woff2' },
    ],
  },

  postcss: {
    plugins: {
      'postcss-preset-env': {},
    },
  },
});
