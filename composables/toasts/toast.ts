import type { ShallowRef } from 'vue';
import type { MaybeRefOrGetter } from '@vueuse/core';

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

export interface ToastsInstanceOptions {
  id: ToastInstance['id']
  message: ToastInstance['message']
  remove: () => void
  priority?: ToastInstance['priority']
  duration?: ToastInstance['duration']
  type?: ToastInstance['type']
  buttons?: ToastInstance['buttons']
}

export class Toast implements ToastInstance {
  public readonly id: number;
  public readonly message: MaybeRef<string>;
  public readonly priority: number;
  public readonly duration: number;
  public readonly type: ToastType; ;
  public readonly el: ShallowRef<HTMLOutputElement | null>;
  public readonly buttons: Array<ToastButton>;
  public readonly remove: () => void;

  constructor(opts: ToastsInstanceOptions) {
    this.id = opts.id;
    this.message = opts.message;
    this.remove = opts.remove;

    this.priority = opts.priority ?? 0;
    this.duration = opts.duration ?? 6000;
    this.type = opts.type ?? 'info';
    this.buttons = opts.buttons ?? [];
    this.el = shallowRef(null);
  }
}
