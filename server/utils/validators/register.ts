import { compile, v } from 'suretype';

export const registerSchema = v.object({
  username: v.string().minLength(4).required(),
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

export const useRegisterValidator = compile(registerSchema);
