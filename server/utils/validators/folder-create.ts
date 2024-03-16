import { compile, v } from 'suretype';

export const folderCreateSchema = v.object({
  name: v.string().minLength(2).maxLength(50).matches(allowedItemNameRE).required(),
  path: v.string().minLength(7).required(), // minLength 7 because - min username - 3 chars and min folder name - 2 + 2 slashes
  parentId: v.string().matches(stringifiedBigIntRE).minLength(19).required(),
}).additional(false);

export const useFolderCreateValidation = compile(folderCreateSchema);
