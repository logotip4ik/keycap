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
      filename: './types/icons.d.ts',
      getContents: () => {
        return `export type IconPath = ${iconPathsDefinition};`;
      },
    });

    addImports({
      type: true,
      from: dst,
      name: 'IconPath',
    });

    logger.info(`Added ${icons.length} icons types`);
  },
});
