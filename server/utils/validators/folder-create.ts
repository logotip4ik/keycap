import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const folderCreateSchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 50, pattern: allowedItemNameRE.source }),
  path: Type.String({ minLength: 7, maxLength: 100 }),
  parentId: Type.String({ minLength: 1, maxLength: 19, pattern: stringifiedBigIntRE.source }),
}, { additionalProperties: false });

export const folderCreateValidator = TypeCompiler.Compile(folderCreateSchema);
