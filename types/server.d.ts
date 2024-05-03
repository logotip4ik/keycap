import type { Selectable } from 'kysely';

import type { User } from '~/kysely/db/types';
import type { createTimer } from '~/server/utils/timers';
import type { OAuthProvider } from '~/server/utils/oauth';

export type SafeUser = Pick<Selectable<User>, 'id' | 'email' | 'username'>;

export declare module 'h3' {
  interface H3EventContext {
    user?: SafeUser
    timer?: ReturnType<typeof createTimer>
  }
}

export interface NormalizedSocialUser {
  id: string
  email: string
  username: string
  type: OAuthProvider
}

// eslint-disable-next-line ts/no-redeclare
export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];

export {};
