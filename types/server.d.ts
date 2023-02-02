import type { User } from '@prisma/client'

declare global {
  // @link https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors
  // ofetch bundled with nuxt will automatically throw error ok:false
  interface QuickResponse { 
    ok: boolean
  }
}

export declare module 'H3' {
  interface H3EventContext {
    user: Pick<User, 'id' | 'username' | 'email'> | null
  }
}

export { }