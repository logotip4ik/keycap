import { compile, v } from 'suretype';

import { usernameSchema } from '~/server/utils/validators/user';

const { features } = useRuntimeConfig().public;

export const registerSchema = v.object({
  'username': usernameSchema,
  'email': v.string().format('email').required(),
  'password': v.string().minLength(8).required(),
  'cf-turnstile-response': features.turnstile ? v.string().required() : v.string(),
  'browserAction': v.boolean(),
});

export const useRegisterValidation = compile(registerSchema);
