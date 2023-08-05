import { readFile, readdir } from 'node:fs/promises';
import { addComponent, addTemplate, defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'pathe';
import { camelCase, pascalCase } from 'scule';
import { optimize as optimizeSvg } from 'svgo';
import { compileTemplate } from 'vue/compiler-sfc';

export default defineNuxtModule({
  meta: {
    name: 'svg-icons',
  },
  async setup(_options, nuxt) {
    const prefix = 'icon';
    const svgDir = resolve(nuxt.options.srcDir, './assets/svg');
    const svgs = await readdir(svgDir);

    for (const path of svgs) {
      const [iconName] = path.split('.');
      const name = `${prefix}-${iconName}`;

      const icon = {
        name: camelCase(name),
        pascalCase: pascalCase(name),
        kebabCaseName: name,
        path: resolve(svgDir, path),
      };

      const { dst } = addTemplate({
        write: true,
        filename: `${icon.kebabCaseName}.mjs`,
        getContents: async () =>
          await generateIconFileDefinition({ name: icon.pascalCase, path: icon.path }),
      });

      addComponent({
        name: icon.name,
        kebabName: icon.kebabCaseName,
        filePath: dst,
        prefetch: false,
        preload: false,
      });
    }
  },
});

export async function generateIconFileDefinition({ name, path }: { name: string; path: string }) {
  const iconSource = optimizeSvg(await readFile(path, 'utf-8'), {
    path,
    multipass: true,
    floatPrecision: 2,

  }).data
    // NOTE: will this cause issues ?
    // eslint-disable-next-line github/unescaped-html-literal
    .replace('<svg', '<svg v-once');

  const compiledCode = compileTemplate({
    id: name,
    filename: name,
    source: iconSource,
    transformAssetUrls: false,
  }).code;

  return `${compiledCode}\nexport default { render }`;
}
