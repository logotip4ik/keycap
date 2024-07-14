import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const noteCreateSchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 100, pattern: allowedItemNameRE.source }),
  // 100 for parent folder length and another 100 for note name itself
  path: Type.String({ minLength: 7, maxLength: 100 + 100 }),
  parentId: Type.String({ minLength: 18, maxLength: 18, pattern: stringifiedBigIntRE.source }),
}, { additionalProperties: false });

export const noteCreateValidator = TypeCompiler.Compile(noteCreateSchema);
