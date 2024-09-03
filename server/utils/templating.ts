const varsRE = /\{\{\s?(\w+)\s?\}\}/;
export function processTemplate(template: string, vars: Record<string, string | number>) {
  let match: RegExpExecArray | undefined | null;

  // eslint-disable-next-line no-cond-assign
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
