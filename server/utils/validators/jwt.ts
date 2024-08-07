import { FormatRegistry, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

FormatRegistry.Set('email', (value) => emailRE.test(value));

export const jwtPayloadSchema = Type.Object({
  sub: Type.String({ minLength: 1, maxLength: 19, pattern: stringifiedBigIntRE.source }),
  email: Type.String({ format: 'email', maxLength: 100 }),
  username: usernameSchema,
}, { additionalProperties: true });

export const jwtPayloadValidator = TypeCompiler.Compile(jwtPayloadSchema);
