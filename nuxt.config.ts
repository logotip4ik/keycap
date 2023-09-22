import UnheadVite from '@unhead/addons/vite';
import parseDuration from 'parse-duration';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { join, resolve } from 'pathe';
import { isCI, isDevelopment, isProduction } from 'std-env';

import type { ComponentsDir } from 'nuxt/schema';

import { getHeaders } from './headers.config';
import { breakpoints, sidebarsBreakpoints } from './constants/breakpoints';
import { ParseDurationTransformPlugin } from './vite/transform-parse-duration';

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
    headNext: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['vitest/importMeta'],
      },
      exclude: [
        '../data',
        '../benchmarks',
        '../scripts',
        '../components/workspace/OldContents',
        '../components/workspace/OldNavbar.vue',
      ],
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

      errors: {
        url: '',
        apiKey: '',
      },
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

  hooks: {
    // removes `old` components from auto-import
    'components:dirs': function (dirs) {
      const componentsPath = resolve('./components');
      const componentsDirIdx = dirs.findIndex((dir) => (dir as ComponentsDir).path === componentsPath);

      const componentsDir = dirs[componentsDirIdx] as ComponentsDir;

      componentsDir.ignore ||= [];
      componentsDir.ignore.push('**/Old*/**');
      componentsDir.ignore.push('**/Old*');
    },
    // minifies service worker
    'nitro:init': function (nitro) {
      if (isDevelopment)
        return;

      const terserPromise = import('terser');
      const fspPromise = import('node:fs/promises');

      nitro.hooks.hookOnce('compiled', async (nitro) => {
        const terser = await terserPromise;
        const fsp = await fspPromise;

        const { publicDir } = nitro.options.output;

        const swPath = join(publicDir, 'sw.js');
        const swSource = await fsp.readFile(swPath, 'utf-8');
        const swMinified = await terser.minify(swSource, {
          compress: true,
          mangle: true,
          ecma: 2020,
          sourceMap: false,
          ie8: false,
          safari10: false,
        });

        await fsp.writeFile(swPath, swMinified.code!);
      });
    },
  },

  vite: {
    define: {
      'import.meta.vitest': 'undefined',
      'isDevelopment': isDevelopment.toString(),
      'isProduction': isProduction.toString(),
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
        '@popperjs/core',
      ],
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            Object.entries(breakpoints).map(([key, value]) => `$breakpoint-${key}: ${value}px;`).join('\n'),
            Object.entries(sidebarsBreakpoints).map(([key, value]) => `$sidebar-breakpoint-${key}: ${value}px;`).join('\n'),
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
          types: ['vitest/importMeta'],
        },
      },
    },

    esbuild: {
      options: {
        // minify: true,
        target: 'esnext',

        define: {
          'globalThis._importMeta_.vitest': 'undefined',
          'isDevelopment': isDevelopment.toString(),
          'isProduction': isProduction.toString(),
        },
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
    minify: true, // TODO: why this is not working ? https://github.com/vite-pwa/nuxt/issues/62

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
