import { compile, v } from 'suretype';

export const jwtPayloadSchema = v.object({
  sub: v.string().minLength(18).maxLength(18).matches(stringifiedBigIntRE).required(),
  email: v.string().format('email').required(),
  username: usernameSchema,
}).additional(true);

export const isJwtPayload = compile(jwtPayloadSchema, { simple: true });
