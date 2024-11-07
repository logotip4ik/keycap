import type { createTimer } from '#server/utils/timers';

declare module 'h3' {
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

export {};
