import { addTemplate, defineNuxtModule } from '@nuxt/kit';
import { isDevelopment } from 'std-env';
import { join } from 'pathe';

export default defineNuxtModule({
  async setup(_, nuxt) {
    let publicDir: string;

    nuxt.hook('nitro:init', (nitro) => {
      publicDir = nitro.options.output.publicDir;
    });

    const { dst } = addTemplate({
      write: true,
      filename: 'resolved-paths.mjs',
      getContents: ({ nuxt }) => {
        const publicPath = isDevelopment ? join(nuxt.options.rootDir, nuxt.options.dir.public) : publicDir;

        return `export const publicPath = '${publicPath}'`;
      },
    });

    nuxt.options.nitro.alias ||= {};
    nuxt.options.nitro.alias['#resolved-paths'] = dst;
  },
});
