import { compile, v } from 'suretype';

export const jwtPayloadSchema = v.object({
  id: v.string().minLength(18).required(),
  email: v.string().minLength(5).required(),
  username: v.string().minLength(3).required(),
  iss: v.string().minLength(5).required(),
  iat: v.number().required(),
  exp: v.number().required(),
});

export const isJwtPayload = compile(jwtPayloadSchema, { simple: true });
