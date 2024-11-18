import { generateItemPath } from '#imports';

import { describe, expect, it } from 'vitest';

describe('generateItemPath', () => {
  it('should generate browser path with correct item path', () => {
    const path = '/help/me';

    expect(generateItemPath({ path })).toEqual('/@help/me');
    expect(generateItemPath({ path, root: false })).toEqual('/@help/me/_blank');
  });
});
