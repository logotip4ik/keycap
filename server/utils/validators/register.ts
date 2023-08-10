import { compile, v } from 'suretype';

export const registerSchema = v.object({
  // TODO: sync with oauth username check
  username: v.string().minLength(4).required(),
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

export const useRegisterValidation = compile(registerSchema);
