import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const noteCreateSchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 50, pattern: allowedItemNameRE.source }),
  path: Type.String({ minLength: 7, maxLength: 100 }),
  parentId: Type.String({ minLength: 18, maxLength: 18, pattern: stringifiedBigIntRE.source }),
}, { additionalProperties: false });

export const noteCreateValidator = TypeCompiler.Compile(noteCreateSchema);
