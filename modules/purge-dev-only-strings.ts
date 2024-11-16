import { addVitePlugin, defineNuxtModule } from '@nuxt/kit';
import decomment from 'decomment';
import MagicString from 'magic-string';
import { isDevelopment } from 'std-env';

// NOTE: taken from - https://github.com/elk-zone/elk/blob/main/modules/purge-comments.ts
export default defineNuxtModule({
  meta: {
    name: 'purge-dev-only-strings',
  },
  setup(_options, nuxt) {
    if (isDevelopment || process.env.NODE_ENV === 'test' || nuxt.options._prepare) {
      return;
    }

    addVitePlugin({
      name: 'purge-test-id',
      enforce: 'pre',
      transform: (code, id) => {
        if (!id.endsWith('.vue') || !code.includes('data-testId')) {
          return;
        }

        const s = new MagicString(code);

        s.replaceAll(/data-testId=".*?"/g, '');

        return {
          code: s.toString(),
          map: s.generateMap({
            source: id,
            hires: true,
          }),
        };
      },
    });

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
