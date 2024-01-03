import { customAlphabet } from 'nanoid';

// three parts with four characters each
// ~35 years needed, in order to have a 1% probability of at least one collision.
const partsNumber = 3;
const partLength = 4;
const DEFAULT_LINK_LENGTH = partsNumber * partLength;

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', DEFAULT_LINK_LENGTH);
const splitLinkRE = new RegExp(`[A-Z\\d]{${partLength}}`, 'g');
const linkRE = new RegExp(
  Array.from({ length: partsNumber }, () => `[0-9A-Z]{${partLength}}`).join('-'),
);

export function generateShareLink() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
  return nanoid().replace(splitLinkRE, '-$&').slice(1);
}

export function isShareLinkValid(link: string): boolean {
  return linkRE.test(link);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('Share links', () => {
    it('correctly generates share link', () => {
      const link = generateShareLink();

      expect(isShareLinkValid(link)).toBe(true);
    });
  });
}
