declare global {
  // @link https://github.com/unjs/ofetch#%EF%B8%8F-handling-errors
  // ofetch bundled with nuxt will automatically throw error ok:false
  interface QuickResponse { 
    ok: boolean
  }
}

export { }