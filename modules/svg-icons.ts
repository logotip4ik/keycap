import { readdir, readFile } from 'node:fs/promises';
import { addComponent, addTemplate, addTypeTemplate, defineNuxtModule, useLogger } from '@nuxt/kit';
import { resolve } from 'pathe';
import colors from 'picocolors';
import { camelCase, pascalCase } from 'scule';
import { optimize as optimizeSvg } from 'svgo';
import { compileTemplate } from 'vue/compiler-sfc';

export default defineNuxtModule({
  meta: {
    name: 'svg-icons',
  },
  async setup(_options, nuxt) {
    const logger = useLogger('svg-icons');

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
        filename: `icons/${icon.kebabCaseName}.mjs`,
        getContents: async () =>
          await generateIconFileDefinition({ name: icon.pascalCase, path: icon.path }),
      });

      addComponent({
        name: icon.name,
        kebabName: icon.kebabCaseName,
        filePath: dst,
      });
    }

    logger.success(`Created ${colors.cyan(svgs.length)} icons`);

    addTypeTemplate({
      write: true,
      filename: './types/icons-shim.d.ts',
      async getContents() {
        const contents = [
          'declare module \'icons/icon-*\' {',
          '  import { DefineComponent } from \'vue\'',
          '  const component: DefineComponent<{}, {}, any>',
          '  export default component',
          '}',
        ];

        return contents.join('\n');
      },
    });
  },
});

export async function generateIconFileDefinition({ name, path }: { name: string, path: string }) {
  const iconSource = optimizeSvg(await readFile(path, 'utf8'), {
    path,
    multipass: true,
    floatPrecision: 2,
    plugins: [
      { name: 'preset-default' },
      {
        name: 'prefixIds',
        params: {
          prefixIds: true,
        },
      },
    ],
  }).data.replace('<svg', '<svg v-once');

  const compiledCode = compileTemplate({
    id: name,
    filename: name,
    source: iconSource,
    transformAssetUrls: false,
  }).code;

  return `${compiledCode}\nexport default { render }`;
}
