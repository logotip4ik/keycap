import { compile, v } from 'suretype';

export const noteUpdateSchema = v.object({
  name: v.string().minLength(2).maxLength(50).matches(allowedItemNameRE),
  content: v.string(),
}).additional(false);

export const useNoteUpdateValidation = compile(noteUpdateSchema);
