import { FormatRegistry, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// import is needed for vitest ?
import { emailRE } from '~/server/utils/index';

FormatRegistry.Set('email', (value) => emailRE.test(value));

export const socialUserSchema = Type.Object({
  id: Type.Union([
    Type.String({ minLength: 21, maxLength: 21, pattern: '[\\d]{21}' }),
    Type.Number({ minimum: 0 }),
  ]),
  email: Type.String({ format: 'email' }),
}, { additionalProperties: true });

export const socialUserValidator = TypeCompiler.Compile(socialUserSchema);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('Social user', () => {
    it('google like user', () => {
      const user = {
        id: '7'.repeat(21),
        email: 'some@email.com',
        foo: 'bar',
      };

      const validation = socialUserValidator.Check(user);

      expect(validation).toBe(true);
    });

    it('github like user', () => {
      const user = {
        id: 12341532,
        email: 'some@email.com',
        foo: 'bar',
      };

      const validation = socialUserValidator.Check(user);

      expect(validation).toBe(true);
    });

    it('broken user', () => {
      const user = {
        id: '12341234',
        email: 'some@email.com',
      };

      const validation = socialUserValidator.Check(user);

      expect(validation).toBe(false);
    });
  });
}
