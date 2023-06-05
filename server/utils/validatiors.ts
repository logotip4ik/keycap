import { compile, v } from 'suretype';

export const loginSchema = v.object({
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

export const useLoginValidator = compile(loginSchema, { colors: false });

export const registrationSchema = v.object({
  username: v.string().minLength(4).required(),
  email: v.string().format('email').required(),
  password: v.string().minLength(8).required(),
});

export const useRegistrationValidator = compile(registrationSchema, { colors: false });

export const noteUpdateSchema = v.object({
  name: v.string().minLength(2),
  content: v.string(),
});

export const useNoteUpdateValidator = compile(noteUpdateSchema, { colors: false });
