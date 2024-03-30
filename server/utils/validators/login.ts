import { FormatRegistry, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

FormatRegistry.Set('email', (value) => emailRE.test(value));

export const loginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  browserAction: Type.Optional(
    Type.Boolean(),
  ),
}, { additionalProperties: false });

export const loginValidator = TypeCompiler.Compile(loginSchema);
