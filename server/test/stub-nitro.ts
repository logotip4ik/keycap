import { vitest } from 'vitest';

import { emailRE } from '../utils/index';

const stubs = {
  defineEventHandler: (func: any) => func,
  defineNitroPlugin: (func: any) => func,
  emailRE,
} as const;

for (const [name, stub] of Object.entries(stubs)) {
  vitest.stubGlobal(name, stub);
}
