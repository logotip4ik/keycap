import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const folderUpdateSchema = Type.Object({
  name: Type.Optional(
    Type.String({ minLength: 2, maxLength: 50, pattern: allowedItemNameRE.source }),
  ),
}, { additionalProperties: false });

export const folderUpdateValidator = TypeCompiler.Compile(folderUpdateSchema);
