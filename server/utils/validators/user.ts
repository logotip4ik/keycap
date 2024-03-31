import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const usernameSchema = Type.String({
  minLength: 3,
  maxLength: 16,
  pattern: usernameRE.source,
});

export const usernameValidator = TypeCompiler.Compile(usernameSchema);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('username validation', () => {
    it('disallows spaces', () => {
      const username = 'userna me';

      const validation = usernameValidator.Check(username);

      expect(validation).toBe(false);
    });

    it('should be valid case', () => {
      const username = 'something';

      const validation = usernameValidator.Check(username);

      expect(validation).toBe(true);
    });

    it('allows alphanumeric values', () => {
      const username = 'li.34t-h3s';

      const validation = usernameValidator.Check(username);

      expect(validation).toBe(true);
    });

    it('disallows empty values', () => {
      const username = '';

      const validation = usernameValidator.Check(username);

      expect(validation).toBe(false);
    });
  });
}
