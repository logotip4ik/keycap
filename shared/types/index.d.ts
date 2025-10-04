import type { Config } from '~~/config/build';

export interface BuildInfo {
  time: number
  commit: string
  version: string
}

export declare global {
  interface BigInt {
    toJSON: () => string
  }

  interface ImportMeta {
    dev: boolean
    prod: boolean
    ci: boolean
    test: boolean

    config: Config
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
export {};
