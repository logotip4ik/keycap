import { createTimer } from '~/server/utils/timers' 

import type { User } from '@prisma/client'

declare global {
  // @link https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors
  // ofetch bundled with nuxt will automatically throw error on ok:false
  interface QuickResponse { 
    ok: boolean
  }
}

export interface SafeUser extends Pick<User, 'id' | 'email' | 'username'> {}

export declare module 'h3' {
  interface H3EventContext {
    identifier: string
    user?: SafeUser | null
    timer?: ReturnType<typeof createTimer>
    logger: Awaited<ReturnType<typeof createLogger>>
  }
}

export { }