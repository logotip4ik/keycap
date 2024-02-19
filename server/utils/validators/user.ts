import { compile, v } from 'suretype';

import { usernameRE } from '~/server/utils';

export const usernameSchema = v
  .string()
  .matches(usernameRE)
  .minLength(3)
  .maxLength(16)
  .required();

export const useUsernameValidator = compile(usernameSchema);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('username validation', () => {
    it('disallows spaces', () => {
      const username = 'userna me';

      const validation = useUsernameValidator(username);

      expect(validation.ok).toBe(false);
    });

    it('should be valid case', () => {
      const username = 'something';

      const validation = useUsernameValidator(username);

      expect(validation.ok).toBe(true);
    });

    it('allows alphanumeric values', () => {
      const username = 'li.34t-h3s';

      const validation = useUsernameValidator(username);

      expect(validation.ok).toBe(true);
    });

    it('disallows empty values', () => {
      const username = '';

      const validation = useUsernameValidator(username);

      expect(validation.ok).toBe(false);
    });
  });
}
