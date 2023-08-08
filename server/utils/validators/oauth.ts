import { compile, v } from 'suretype';

export const socialUserSchema = v.object({
  id: v.anyOf([
    v.string().numeric().minLength(21).maxLength(21),
    v.number().gte(0),
  ]).required(),

  email: v.string().format('email').required(),
}).additional(true);

export const useSocialUserValidator = compile(socialUserSchema);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('Social user', () => {
    it('google like user', () => {
      const user = {
        id: '7'.repeat(21),
        email: 'some@email.com',
        foo: 'bar',
      };

      const validation = useSocialUserValidator(user);

      expect(validation.ok).toBe(true);
    });

    it('github like user', () => {
      const user = {
        id: 12341532,
        email: 'some@email.com',
        foo: 'bar',
      };

      const validation = useSocialUserValidator(user);

      expect(validation.ok).toBe(true);
    });

    it('broken user', () => {
      const user = {
        id: '12341234',
        email: 'some@email.com',
      };

      const validation = useSocialUserValidator(user);

      expect(validation.ok).toBe(false);
    });
  });
}
