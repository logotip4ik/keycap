import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const noteUpdateSchema = Type.Object({
  name: Type.Optional(
    Type.String({ minLength: 2, maxLengthL: 50, pattern: allowedItemNameRE.source }),
  ),
  content: Type.Optional(
    Type.String(),
  ),
}, { additionalProperties: false });

export const noteUpdateValidator = TypeCompiler.Compile(noteUpdateSchema);
