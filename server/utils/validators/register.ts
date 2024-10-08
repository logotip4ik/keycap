import { FormatRegistry, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

FormatRegistry.Set('email', (value) => emailRE.test(value));

export const emailRegisterSchema = Type.Object({
  email: Type.String({ format: 'email', maxLength: 100 }),
  browserAction: Type.Optional(
    Type.Boolean(),
  ),
});

// 32 default registration code length + one underscore
const codeLength = KeyPrefix.Register.length + 32 + 1;
export const registerSchema = Type.Object({
  'username': usernameSchema,
  'email': Type.String({ format: 'email', maxLength: 100 }),
  'password': Type.String({ minLength: 8, maxLength: 64 }),
  'code': Type.String({ minLength: codeLength, maxLength: codeLength }),
  'cf-turnstile-response': import.meta.config.turnstileEnabled
    ? Type.String()
    : Type.Optional(Type.String()),
  'browserAction': Type.Optional(
    Type.Boolean(),
  ),
});

export const emailRegisterValidator = TypeCompiler.Compile(emailRegisterSchema);
export const registerValidator = TypeCompiler.Compile(registerSchema);
