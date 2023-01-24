interface Shortcuts {
  new: string
  search: string
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    shortcuts: Shortcuts

    iconsToPreload?: string[]
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
