import { join } from 'pathe';

import type { ResvgRenderOptions } from '@resvg/resvg-js';

// @ts-expect-error virtual file
import { publicPath } from '#resolved-paths';

const resvgOptions = {
  logLevel: import.meta.dev ? 'info' : 'off',
  fitTo: { mode: 'original' },
  font: {
    loadSystemFonts: false,
    fontFiles: [
      join(publicPath, 'MonaSans-Regular.ttf'),
    ],
  },
} satisfies ResvgRenderOptions;

export async function generatePngFromSvg(svg: string) {
  const { renderAsync } = await import('@resvg/resvg-js');

  const image = await renderAsync(svg, resvgOptions);

  return image.asPng();
}

export type TemplateName = 'view';
export async function getOgTemplate(name: TemplateName) {
  const storage = useStorage('assets:server:og');

  const template = await storage.getItem<string>(`${name}:template.svg`);

  if (!template)
    throw new Error(`template ${name} not found!`);

  return template;
}
