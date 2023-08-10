import { compile, v } from 'suretype';

import { usernameSchema } from '~/server/utils/validators/user';

export const registerSchema = v.object({
  username: usernameSchema,
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

export const useRegisterValidation = compile(registerSchema);
