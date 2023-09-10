import { compile, v } from 'suretype';

export const folderUpdateSchema = v.object({
  name: v.string().minLength(2).maxLength(50).matches(allowedItemNameRE),
});

export const useFolderUpdateValidation = compile(folderUpdateSchema);
