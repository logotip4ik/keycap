import { customAlphabet } from 'nanoid';

// three parts with four characters each
// ~35 years needed, in order to have a 1% probability of at least one collision.
const partsNumber = 3;
const partLength = 4;
const DEFAULT_LINK_LENGTH = partsNumber * partLength;

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', DEFAULT_LINK_LENGTH);
const regexToSplitLink = new RegExp(`[A-Z\\d]{${partLength}}`, 'g');

export function generateShareLink() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
  return nanoid().replace(regexToSplitLink, '-$&').slice(1);
}

export function isShareLinkValid(link: string): boolean {
  const linkParts = link.split('-');

  if (linkParts.length !== partsNumber)
    return false;

  return linkParts.every((part) => part.length === partLength);
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
