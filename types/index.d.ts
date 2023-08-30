export interface BuildInfo {
  time: number
  commit: string
  version: string
}

export declare global {
  interface BigInt {
    toJSON: () => string
  }
}

export interface PrivateBuildInfo {
  id: string
}

export interface DeviceInfo {
  isMobileOrTablet: boolean
  isFirefox: boolean
}

export declare module 'nuxt/schema' {
  interface RuntimeConfig {
    build: PrivateBuildInfo
  }

  interface PublicRuntimeConfig {
    build: BuildInfo
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
