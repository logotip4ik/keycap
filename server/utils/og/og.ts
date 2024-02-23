import type { ResvgRenderOptions } from '@resvg/resvg-js';

const resvgOptions = {
  fitTo: { mode: 'original' },
  font: { loadSystemFonts: false },
  logLevel: import.meta.dev ? 'info' : 'off',
} satisfies ResvgRenderOptions;

export async function generatePngFromSvg(svg: string) {
  const { renderAsync } = await import('@resvg/resvg-js');

  return await renderAsync(svg, resvgOptions);
}

export type TemplateName = 'view';
export async function getOgTemplate(name: TemplateName) {
  const storage = useStorage('assets:server:og');

  const template = await storage.getItem<string>(`${name}:template.svg`);

  if (!template)
    throw new Error(`template ${name} not found!`);

  return template;
}
