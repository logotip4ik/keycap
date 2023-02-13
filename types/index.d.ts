interface Shortcuts {
  new: string
  search: string
}

export interface BuildInfo {
  time: number
  commit: string
}

export declare global {
  interface BigInt {
    toJSON: () => string
  }
}

export declare module '@nuxt/schema' {
  interface AppConfigInput {
    shortcuts: Shortcuts

    buildInfo?: BuildInfo
    
    iconsToPreload?: string[]
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
