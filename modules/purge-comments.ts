import { addVitePlugin, defineNuxtModule } from '@nuxt/kit';
import MagicString from 'magic-string';
import { isDevelopment } from 'std-env';

// NOTE: taken from - https://github.com/elk-zone/elk/blob/main/modules/purge-comments.ts
export default defineNuxtModule({
  meta: {
    name: 'purge-comments',
  },
  setup(_options, nuxt) {
    if (isDevelopment || nuxt.options._prepare)
      return;

    addVitePlugin({
      name: 'purge-comments',
      enforce: 'pre',
      transform: (code, id) => {
        if (!id.endsWith('.vue') || !code.includes('<!--'))
          return;

        const s = new MagicString(code);
        s.replace(/<!--(?:.*?)-->/sg, '');

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ source: id, includeContent: true }),
          };
        }
      },
    });
  },
});
