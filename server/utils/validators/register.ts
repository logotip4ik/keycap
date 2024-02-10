import { compile, v } from 'suretype';

import { usernameSchema } from '~/server/utils/validators/user';

export const registerSchema = v.object({
  'username': usernameSchema,
  'email': v.string().format('email').required(),
  'password': v.string().minLength(8).required(),
  'cf-turnstile-response': v.string().required(),
  'browserAction': v.boolean(),
});

export const useRegisterValidation = compile(registerSchema);
