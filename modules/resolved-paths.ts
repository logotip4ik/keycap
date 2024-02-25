import { addTemplate, defineNuxtModule, useLogger } from '@nuxt/kit';
import { isDevelopment } from 'std-env';
import { join, relative } from 'pathe';

export default defineNuxtModule({
  async setup(_, nuxt) {
    const logger = useLogger('route-groups');

    let publicDir: string;
    let buildDir: string;

    nuxt.hook('nitro:init', (nitro) => {
      publicDir = nitro.options.output.publicDir;
      buildDir = nitro.options.buildDir;
    });

    const { dst } = addTemplate({
      write: true,
      filename: 'resolved-paths.mjs',
      getContents: ({ nuxt }) => {
        const publicPath = isDevelopment
          ? join(nuxt.options.rootDir, nuxt.options.dir.public)
          : relative(process.cwd(), publicDir);

        logger.info(`Resolved public path: ${publicPath}`);

        return [
          `export const buildDir = '${buildDir}'`,
          `export const publicPath = '${publicPath}'`,
        ].join('\n');
      },
    });

    nuxt.options.nitro.alias ||= {};
    nuxt.options.nitro.alias['#resolved-paths'] = dst;
  },
});
