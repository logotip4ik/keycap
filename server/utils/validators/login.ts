import { FormatRegistry, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

FormatRegistry.Set('email', (value) => emailRE.test(value));

export const loginSchema = Type.Object({
  email: Type.String({ format: 'email', maxLength: 100 }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
  browserAction: Type.Optional(
    Type.Boolean(),
  ),
}, { additionalProperties: false });

export const loginValidator = TypeCompiler.Compile(loginSchema);
