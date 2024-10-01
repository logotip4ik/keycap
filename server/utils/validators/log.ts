import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const clientLogSchema = Type.Object({
  type: Type.Enum(LogLevel),
  payload: Type.Object({
    msg: Type.String(),
  }, { additionalProperties: true }),
}, { additionalProperties: false });

export const clientLogValidator = TypeCompiler.Compile(clientLogSchema);
