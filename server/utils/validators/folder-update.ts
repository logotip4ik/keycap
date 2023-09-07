import { compile, v } from 'suretype';

export const folderUpdateSchema = v.object({
  name: v.string().minLength(2),
});

export const useFolderUpdateValidation = compile(folderUpdateSchema);
