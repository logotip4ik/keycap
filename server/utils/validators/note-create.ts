import { compile, v } from 'suretype';

export const noteCreateSchema = v.object({
  name: v.string().minLength(2).required(),
  path: v.string().minLength(7).required(), // minLength 7 because - min username - 3 chars and min note name - 2 + 2 slashes
  parentId: v.string().matches(stringifiedBigIntRE).minLength(19).required(),
});

export const useNoteCreateSchema = compile(noteCreateSchema);
