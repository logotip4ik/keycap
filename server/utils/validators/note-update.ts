import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const noteUpdateSchema = Type.Object({
  name: Type.Optional(
    Type.String({ minLength: 2, maxLength: 50, pattern: allowedItemNameRE.source }),
  ),
  content: Type.Optional(
    Type.String({
      // my biggest note * 3, this should be enough for everyone (just to prevent abuse)
      maxLength: 400_000,
    }),
  ),
}, { additionalProperties: false });

export const noteUpdateValidator = TypeCompiler.Compile(noteUpdateSchema);
