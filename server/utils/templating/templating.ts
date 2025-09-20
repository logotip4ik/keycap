import { readFile } from 'node:fs/promises';
import invariant from 'tiny-invariant';

import ContinueOnboardingUrl from './assets/continue-onboarding.html';
import FirstNoteUrl from './assets/first-note.html';
import ViewSvgUrl from './assets/view.svg';

const varsRE = /\{\{\s?(\w+)\s?\}\}/;
export function processTemplate(template: string, vars: Record<string, string | number>) {
  let match: RegExpExecArray | undefined | null;

  while ((match = varsRE.exec(template))) {
    const varName = match[1];
    const value = vars[varName];

    if (import.meta.dev && value == null) {
      console.warn(`missing var "${varName}" in template: ${template.substring(0, 400)}...`);
    }

    template = template.substring(0, match.index) + value + template.substring(match.index + match[0].length);
  }

  return template;
}

function readTemplate(template: string, templates: Record<string, string>) {
  const path = templates[template];

  invariant(path, `template ${template} not found`);

  return readFile(path, { encoding: 'utf8' });
}

const htmlTemplates = {
  FirstNote: FirstNoteUrl,
  ContinueOnboarding: ContinueOnboardingUrl,
} as const;
export function getHtmlTemplate(template: keyof typeof htmlTemplates) {
  return readTemplate(template, htmlTemplates);
}

const svgTemplates = {
  view: ViewSvgUrl,
} as const;
export function getOgTemplate(template: keyof typeof svgTemplates) {
  return readTemplate(template, svgTemplates);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('processing html template', () => {
    it('should replace variables with correct values', () => {
      const template = '<div class="{{ something }}"><a>{{beta}}...';

      const html = processTemplate(template, { something: 1, beta: 2 });

      expect(html).toEqual('<div class="1"><a>2...');
    });
  });
}
