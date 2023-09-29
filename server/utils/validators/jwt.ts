import { compile, v } from 'suretype';

import { usernameSchema } from '~/server/utils/validators/user';

export const jwtPayloadSchema = v.object({
  sub: v.string().matches(stringifiedBigIntRE).minLength(19).required(),
  email: v.string().format('email').required(),
  username: usernameSchema,
});

export const isJwtPayload = compile(jwtPayloadSchema, { simple: true });
export const useJwtPayloadValidation = compile(jwtPayloadSchema);
