import { addVitePlugin, defineNuxtModule } from '@nuxt/kit';
import { isDevelopment } from 'std-env';
import MagicString from 'magic-string';
import decomment from 'decomment';

// NOTE: taken from - https://github.com/elk-zone/elk/blob/main/modules/purge-comments.ts
export default defineNuxtModule({
  meta: {
    name: 'purge-comments',
  },
  setup(_options, nuxt) {
    if (isDevelopment || nuxt.options._prepare) {
      return;
    }

    addVitePlugin({
      name: 'purge-comments',
      enforce: 'pre',
      transform: (code, id) => {
        if (!id.endsWith('.vue') || !code.includes('<!--')) {
          return;
        }

        const decommented = decomment.html(code);

        if (decommented !== code) {
          const s = new MagicString(decommented);

          return {
            code: s.toString(),
            map: s.generateMap({
              source: id,
              hires: true,
            }),
          };
        }
      },
    });
  },
});
