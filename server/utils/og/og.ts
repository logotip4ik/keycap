import { readFile } from 'node:fs/promises';
import type { ResvgRenderOptions } from '@resvg/resvg-js';

import MonaSansUrl from './assets/fonts/MonaSans-Regular.ttf';
import ViewTemplateUrl from './assets/templates/view.svg';

const resvgOptions = {
  logLevel: import.meta.dev ? 'info' : 'error',
  fitTo: { mode: 'original' },
  font: {
    loadSystemFonts: false,
    fontFiles: [MonaSansUrl],
  },
} satisfies ResvgRenderOptions;

export async function generatePngFromSvg(svg: string) {
  const { renderAsync } = await import('@resvg/resvg-js');

  const image = await renderAsync(svg, resvgOptions);

  return image.asPng();
}

const templates = {
  view: ViewTemplateUrl,
} as const;
export async function getOgTemplate(name: keyof typeof templates) {
  const url = templates[name];

  if (!url)
    throw new Error(`template ${name} not found!`);

  const template = await readFile(url, { encoding: 'utf8' });

  return template;
}

// https://antfu.me/posts/break-lines-in-js
const maxLineLength = 20;
const splitByLineLengthRE = new RegExp(`(.{0,${maxLineLength}})(?:\\s|$)`);
export function splitOgText(text: string, maxLines?: number) {
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

      expect(splitOgText(text)).toStrictEqual([
        'Lorem ipsum dolor',
        'sit amet,',
        'consectetur',
        'adipiscing elit',
      ]);
    });

    it('should split one long word', () => {
      const text = 'a'.repeat(50);

      expect(splitOgText(text)).toStrictEqual([
        'aaaaaaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaaaaaa',
        'aaaaaaaaaa',
      ]);
    });

    it('should split words and take into accout max lines', () => {
      const text = 'a'.repeat(50);

      expect(splitOgText(text, 2)).toStrictEqual([
        'aaaaaaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaaaaaa...',
      ]);
    });
  });
}
