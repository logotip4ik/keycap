import { withoutLeadingSlash } from 'ufo';
import { lowerFirst } from 'scule';

import type { ValueError } from '@sinclair/typebox/value';

export function formatTypboxError(error: ValueError) {
  return `${withoutLeadingSlash(error.path)}: ${lowerFirst(error.message)}`;
}
