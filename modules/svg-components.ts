import { readdir } from 'node:fs/promises';
import { addComponent, addTemplate, defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'pathe';
import { camelCase, kebabCase } from 'scule';

export default defineNuxtModule({
  meta: {
    name: 'svg-icons',
  },
  async setup(_options, nuxt) {
    if (nuxt.options._prepare)
      return;

    const prefix = 'icon';
    const svgDir = resolve(nuxt.options.srcDir, './assets/svg');
    const svgs = await readdir(svgDir);

    for (const svg of svgs) {
      const [iconName] = svg.split('.');

      const name = `${prefix}-${iconName}`;

      const { dst } = addTemplate({
        filename: `${name}.mjs`,
        getContents: () => `import { defineAsyncComponent } from 'vue';
export default defineAsyncComponent(() => import("${resolve(svgDir, svg)}?component"))`,
      });

      addComponent({
        name: camelCase(name),
        kebabName: kebabCase(name),
        filePath: dst,
      });
    }
  },
});
