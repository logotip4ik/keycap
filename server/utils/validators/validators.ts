import { withoutLeadingSlash } from 'ufo';

import type { Static, TSchema } from '@sinclair/typebox';
import type { TypeCheck } from '@sinclair/typebox/compiler';
import type { ValueError } from '@sinclair/typebox/value';
import type { H3Event } from 'h3';

export function formatTypboxError(error: ValueError) {
  return `${error.message}: ${withoutLeadingSlash(error.path)}`;
}

export async function readSecureBody<Schema extends TSchema>(
  event: H3Event,
  validator: TypeCheck<Schema>,
  overrides?: Record<string, unknown>,
): Promise<Static<Schema>> {
  const contentType = getHeader(event, 'content-type');

  if (
    !contentType || (
      contentType !== 'application/json'
      && contentType !== 'application/x-www-form-urlencoded'
    )
  ) {
    throw createError({ status: 415 });
  }

  const body = await readBody(event);

  if (!body || typeof body !== 'object') {
    throw createError({ status: 400 });
  }

  if (overrides) {
    Object.assign(body, overrides);
  }

  for (const key in body) {
    const value = body[key];

    if (typeof value === 'string') {
      body[key] = value.trim();
    }
  }

  const error = validator.Errors(body).First();

  if (error) {
    throw createError({
      status: 400,
      message: formatTypboxError(error),
    });
  }

  return body;
}
