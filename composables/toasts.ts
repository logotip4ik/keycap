import type { ShallowRef } from 'vue';

const toasts = shallowRef<ToastInstance[]>([]);

export const useToasts = () => toasts;

export function useToast() {
  return (message: string, options?: Partial<Omit<ToastInstance, 'id' | 'message' | 'delete'>>) => {
    const toast = createToast({ ...(options ?? {}), message });

    toasts.value = toasts.value.concat(toast);

    return toast;
  };
}

function createToast(options: Partial<Omit<ToastInstance, 'id' | 'delete'>>): ToastInstance {
  options.message = (options.message ?? '').trim();

  if (options.message === '')
    throw new Error('no message was provided');

  const toastId = Math.floor(Math.random() * 9999999);

  return {
    id: toastId,
    message: options.message,
    priority: options.priority ?? 0,
    duration: options.duration ?? 2250,
    type: options.type ?? 'info',
    el: shallowRef(null),
    remove: () => {
      toasts.value = toasts.value.filter((toast) => toast.id !== toastId);
    },
  };
}

type ToastType = 'info' | 'loading';

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
   * @default 2250
   */
  duration: number
  type: ToastType
  el: ShallowRef<HTMLOutputElement | null>
  remove: () => void
}
