import { createTimer } from '~/server/utils/timers' 
import { OAuthProvider } from '~/server/utils/oauth'

declare global {
  // @link https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors
  // ofetch bundled with nuxt will automatically throw error on ok:false
  interface QuickResponse { 
    ok: boolean
  }
}

export interface SafeUser { id: string, email: string, username: string }

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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];

export { }