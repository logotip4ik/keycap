import { compile, v } from 'suretype';

export const jwtPayloadSchema = v.object({
  sub: v.string().matches(stringifiedBigIntRE).minLength(19).required(),
  email: v.string().format('email').required(),
  username: usernameSchema,
});

export const isJwtPayload = compile(jwtPayloadSchema, { simple: true });
