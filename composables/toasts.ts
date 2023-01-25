import type { ShallowRef } from 'vue';

const toasts = shallowRef<ToastInstance[]>([]);

export const useToasts = () => toasts;

export function useToast() {
  return (message: string, options?: ToastUserOptions & { delay?: number }): ToastInstance => {
    const timeout: { value: NodeJS.Timeout | null } = { value: null };

    const toast = createToast({ ...(options ?? {}), message, timeout });

    const updateToasts = () => {
      timeout.value = null;
      toasts.value = toasts.value.concat(toast);
    };

    if (options?.delay)
      timeout.value = setTimeout(updateToasts, options.delay);
    else
      updateToasts();

    return toast;
  };
}

function createToast(options: ToastUserOptions & { message?: string; timeout: { value: NodeJS.Timeout | null } }): ToastInstance {
  options.message = (options.message ?? '').trim();

  if (options.message === '')
    throw new Error('no message was provided');

  const toastId = Math.floor(Math.random() * 9999999);

  return {
    id: toastId,
    message: options.message,
    priority: options.priority ?? 0,
    duration: options.duration ?? 6000,
    type: options.type ?? 'info',
    el: shallowRef(null),
    remove: () => {
      if (options.timeout && options.timeout.value)
        clearTimeout(options.timeout.value);
      else
        toasts.value = toasts.value.filter((toast) => toast.id !== toastId);
    },
  };
}

type ToastType = 'info' | 'loading';

export type ToastUserOptions = Partial<Omit<ToastInstance, 'id' | 'message' | 'remove' | 'el' | 'delete'>>;

export interface ToastInstance {
  id: number
  // TODO: add support for html ?
  message: string
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
  remove: () => void
}
