// created with help of Gemini 2.5 pro, grok fast wasn't smart enough
function createFuzzyMatcher() {
  let v0: Array<number> = [];
  let v1: Array<number> = [];
  let currentBufferSize = 0;

  return function fuzzyMatch(pattern: string, text: string): number {
    if (!pattern || !text) {
      return 0;
    }

    const p = pattern.toLowerCase();
    const t = text.toLowerCase();

    // Tier 0: Exact match (fastest path)
    if (p === t) {
      return 10000;
    }

    // Tier 1: Substring Match (very fast native check)
    const index = t.indexOf(p);
    if (index !== -1) {
      const baseScore = 1000;
      const indexPenalty = index * 3;
      const lengthPenalty = t.length;
      return Math.max(0, baseScore - indexPenalty - lengthPenalty);
    }

    // Tier 2: Levenshtein Distance Fallback (Optimized with buffer reuse)
    const s1 = p.length < t.length ? p : t;
    const s2 = p.length < t.length ? t : p;
    const s1len = s1.length;
    const s2len = s2.length;

    if (s1len === 0) {
      return 1.0 / (1.0 + s2len);
    }

    // Check if our buffers are large enough, and resize only if necessary.
    // This is the core of the optimization. Allocation happens only when
    // s1len exceeds the previous maximum.
    if (s1len + 1 > currentBufferSize) {
      currentBufferSize = s1len + 1;
      // eslint-disable-next-line unicorn/no-new-array
      v0 = new Array(currentBufferSize);
      // eslint-disable-next-line unicorn/no-new-array
      v1 = new Array(currentBufferSize);
    }

    for (let i = 0; i <= s1len; i++) {
      v0[i] = i;
    }

    for (let i = 0; i < s2len; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < s1len; j++) {
        const cost = s2[i] !== s1[j] ? 1 : 0;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }

      const temp = v0;
      v0 = v1;
      v1 = temp;
    }

    const distance = v0[s1len];
    return 1.0 / (1.0 + distance);
  };
}

export const fuzzyMatch = createFuzzyMatcher();

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('fuzzyMatch', () => {
    it('should correctly score entries 1', () => {
      const expectedList = [
        'main',
        'maun',
        'chore',
      ];

      const input = 'main';

      expect(
        ['chore', 'maun', 'main'].sort((a, b) => fuzzyMatch(input, b) - fuzzyMatch(input, a)),
      ).toEqual(expectedList);
    });

    it('should correctly score entries 2', () => {
      const expectedList = [
        'main',
        'must watch',
        'anime',
        'something',
        'some testing note',
      ];

      const input = 'm';
      const shuffeledList = expectedList.slice().sort(() => Math.random() - Math.random());

      expect(
        shuffeledList.sort((a, b) => fuzzyMatch(input, b) - fuzzyMatch(input, a)),
      ).toEqual(expectedList);
    });

    it('should correctly score entries 3', () => {
      const expectedList = [
        'main',
        'anime',
        'something',
        'must watch',
        'some testing note',
      ];

      const input = 'main';
      const shuffeledList = expectedList.slice().sort(() => Math.random() - Math.random());

      expect(
        shuffeledList.sort((a, b) => fuzzyMatch(input, b) - fuzzyMatch(input, a))[0],
      ).toEqual('main');
    });

    it('should correctly score entries 4', () => {
      const input = 'f';
      const shuffeledList = [
        'main',
        'anime',
        'something',
        'must watch',
        'future',
        'some testing note',
      ].slice().sort(() => Math.random() - Math.random());

      expect(
        shuffeledList.sort((a, b) => fuzzyMatch(input, b) - fuzzyMatch(input, a))[0],
      ).toEqual('future');
    });

    it('should correctly score entries 5', () => {
      const shuffeledList = [
        'main',
        'anime',
        'something',
        'must watch',
        'future',
        'shaders',
        'oss',
        'new',
        'chore',
        'some testing note',
      ].slice().sort(() => Math.random() - Math.random());

      const input = 'sh';
      expect(
        shuffeledList.sort((a, b) => fuzzyMatch(input, b) - fuzzyMatch(input, a))[0],
      ).toEqual('shaders');
    });

    it('should correctly score entries 6', () => {
      const input = 'c';
      expect(
        [
          'oss',
          'new',
          'main',
          'chore',
        ].sort((a, b) => fuzzyMatch(input, b) - fuzzyMatch(input, a))[0],
      ).toEqual('chore');
    });

    it('should correctly score entries 7', () => {
      const input = '2.2';
      expect(
        [
          'oss',
          'new',
          'main',
          'chore',
          'test 2.2',
        ].sort((a, b) => fuzzyMatch(input, b) - fuzzyMatch(input, a))[0],
      ).toEqual('test 2.2');
    });
  });
}
