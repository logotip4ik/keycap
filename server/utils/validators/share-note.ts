import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const shareNoteSchema = Type.Object({
  // 100 for parent folder length and another 100 for note name itself
  path: Type.String({ minLength: 7, maxLength: 100 + 100 }),
});

export const shareNoteValidator = TypeCompiler.Compile(shareNoteSchema);
