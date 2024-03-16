import type { User } from '@prisma/client';
import type { Serialize } from 'nitropack';
import type { createTimer } from '~/server/utils/timers';
import type { OAuthProvider } from '~/server/utils/oauth';

export type SafeUser = Prettify<Serialize<Pick<User, 'id' | 'email' | 'username'>>>;

export declare module 'h3' {
  interface H3EventContext {
    user?: SafeUser | null
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
