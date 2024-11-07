export type ToastType = 'info' | 'loading';

export interface ToastButton {
  text: MaybeRefOrGetter<string>
  onClick: (instance: ToastInstance) => void
}

export interface ToastInstance {
  id: number
  // TODO: add support for html ?
  // probably should support rendering function instead of html
  message: MaybeRef<string>
  /**
   * should be between 0 and 100
   * - 0 will float freely to top with other toast
   * - 100 will be fixed at the bottom
   * @default 0
   */
  priority: number
  /**
   * in milliseconds
   * @default 6000
   */
  duration: number
  /** @default 'info' */
  type: ToastType
  el: ShallowRef<HTMLOutputElement | null>
  buttons: Array<ToastButton>
  remove: () => void
}
