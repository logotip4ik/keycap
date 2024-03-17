import { compile, v } from 'suretype';

export const noteCreateSchema = v.object({
  name: v.string().minLength(2).maxLength(50).matches(allowedItemNameRE).required(),
  path: v.string().minLength(7).required(), // minLength 7 because - min username - 3 chars and min note name - 2 + 2 slashes
  parentId: v.string().minLength(18).maxLength(18).matches(stringifiedBigIntRE).required(),
}).additional(false);

export const useNoteCreateValidation = compile(noteCreateSchema);
