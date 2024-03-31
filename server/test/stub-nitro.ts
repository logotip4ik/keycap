import { vitest } from 'vitest';

import { emailRE, usernameRE } from '../utils';

const stubs = {
  defineEventHandler: (func: any) => func,
  defineNitroPlugin: (func: any) => func,
  usernameRE,
  emailRE,
} as const;

for (const [name, stub] of Object.entries(stubs)) {
  vitest.stubGlobal(name, stub);
}
