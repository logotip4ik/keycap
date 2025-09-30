import { readdir } from 'node:fs/promises';

import { addImports, addTypeTemplate, defineNuxtModule, useLogger } from '@nuxt/kit';
import { resolve } from 'pathe';

export default defineNuxtModule({
  meta: {
    name: 'icons',
  },
  async setup(_options, nuxt) {
    const logger = useLogger('icons');

    const icons = await readdir(
      resolve(nuxt.options.rootDir, './public/svg'),
    );

    const iconPathsDefinition = icons
      .map((icon) => JSON.stringify(icon.split('.')[0]))
      .join(' | ');

    const { dst } = addTypeTemplate({
      write: true,
      filename: 'icons.d.ts',
      getContents: () => {
        return `export type IconName = ${iconPathsDefinition};`;
      },
    }, { nitro: false, nuxt: true });

    addImports([
      { type: true, from: dst, name: 'IconName' },
    ]);

    logger.info(`Added ${icons.length} icons types`);
  },
});
