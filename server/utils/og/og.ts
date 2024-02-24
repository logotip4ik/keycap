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

// https://antfu.me/posts/break-lines-in-js
const maxLineLength = 20;
const splitByLineLengthRE = new RegExp(`(.{0,${maxLineLength}})(?:\\s|$)`);
export function splitTextByLineWidth(text: string, maxLines?: number) {
  let lines: Array<string> = [];

  text = text.trim();

  if (text.length === 0)
    return lines;

  let match = splitByLineLengthRE.exec(text);
  while (match !== null && match[0].length !== 0) {
    lines.push(match[1]);

    text = text.slice(match[0].length);

    match = splitByLineLengthRE.exec(text);
  }

  if (maxLines !== undefined && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[lines.length - 1] = `${lines.at(-1)}...`;
  }

  return lines;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('og utils', () => {
    it('should split normal words', () => {
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

      expect(splitTextByLineWidth(text)).toStrictEqual([
        'Lorem ipsum dolor',
        'sit amet,',
        'consectetur',
        'adipiscing elit',
      ]);
    });

    it('should split one long word', () => {
      const text = 'a'.repeat(50);

      expect(splitTextByLineWidth(text)).toStrictEqual([
        'aaaaaaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaaaaaa',
        'aaaaaaaaaa',
      ]);
    });

    it('should split words and take into accout max lines', () => {
      const text = 'a'.repeat(50);

      expect(splitTextByLineWidth(text, 2)).toStrictEqual([
        'aaaaaaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaaaaaa...',
      ]);
    });
  });
}
