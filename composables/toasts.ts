import type { MaybeRefOrGetter } from '@vueuse/core';
import type { ShallowRef } from 'vue';

const toasts = shallowRef<Array<ToastInstance>>([]);
export const useToasts = () => toasts;

export function useToast() {
  return (message: ToastInstance['message'], options?: ToastUserOptions & { delay?: number }): RefToastInstance => {
    const timeout: { value: NodeJS.Timeout | null } = { value: null };

    const toast = createToast({ ...options, message, timeout });

    const addToastToQueue = () => {
      timeout.value = null;
      toasts.value = toasts.value.concat(toast.value!);
    };

    if (options?.delay)
      timeout.value = setTimeout(addToastToQueue, options.delay);
    else
      addToastToQueue();

    return toast;
  };
}

function createToast(options: ToastUserOptions & { message: ToastInstance['message']; timeout: { value: NodeJS.Timeout | null } }): RefToastInstance {
  if (toValue(options.message).trim() === '')
    throw new Error('no message was provided');

  const toastId = Math.floor(Math.random() * 9999999);

  const toast: RefToastInstance = shallowRef({
    id: toastId,
    message: options.message,
    priority: options.priority ?? 0,
    duration: options.duration ?? 6000,
    type: options.type ?? 'info',
    el: shallowRef(null),
    buttons: options.buttons ?? [],
    remove: () => {
      if (options.timeout.value)
        clearTimeout(options.timeout.value);
      else
        toasts.value = toasts.value.filter((toast) => toast.id !== toastId);

      toast.value = undefined;
    },
  });

  return toast;
}

type ToastType = 'info' | 'loading';

export type ToastUserOptions = Partial<Omit<ToastInstance, 'id' | 'message' | 'remove' | 'el' | 'delete'>>;
export interface ToastButton {
  text: MaybeRefOrGetter<string>
  onClick: (instance: ToastInstance) => any
}

export interface ToastInstance {
  id: number
  // TODO: add support for html ?
  // probably should support rendering function instead of html
  message: MaybeRefOrGetter<string>
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
  type: ToastType
  el: ShallowRef<HTMLOutputElement | null>
  buttons: Array<ToastButton>
  remove: () => void
}

export type RefToastInstance = ShallowRef<ToastInstance | null | undefined>;
