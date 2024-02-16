import { compile, v } from 'suretype';

import { usernameSchema } from '~/server/utils/validators/user';

export const registerSchema = v.object({
  'username': usernameSchema,
  'email': v.string().format('email').required(),
  'password': v.string().minLength(8).required(),
  'cf-turnstile-response': import.meta.config.turnstileEnabled ? v.string().required() : v.string(),
  'browserAction': v.boolean(),
});

export const useRegisterValidation = compile(registerSchema);
