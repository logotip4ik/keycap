import { compile, v } from 'suretype';

export const loginSchema = v.object({
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

export const useLoginValidator = compile(loginSchema, { colors: false });
