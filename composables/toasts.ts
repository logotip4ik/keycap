import type { ShallowRef } from 'vue';

const toasts = shallowRef<ToastInstance[]>([]);

// eslint-disable-next-line antfu/top-level-function
export const useToasts = () => toasts;

export function useToast() {
  return (message: string, options?: ToastUserOptions & { delay?: number }): RefToastInstance => {
    const timeout: { value: NodeJS.Timeout | null } = { value: null };

    const toast = createToast({ ...(options ?? {}), message, timeout });

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

function createToast(options: ToastUserOptions & { message?: string; timeout: { value: NodeJS.Timeout | null } }): RefToastInstance {
  options.message = (options.message ?? '').trim();

  if (options.message === '')
    throw new Error('no message was provided');

  const toastId = Math.floor(Math.random() * 9999999);

  const toast: RefToastInstance = {
    value: {
      id: toastId,
      message: options.message,
      priority: options.priority ?? 0,
      duration: options.duration ?? 6000,
      type: options.type ?? 'info',
      el: shallowRef(null),
      remove: () => {
        if (options.timeout.value)
          clearTimeout(options.timeout.value);
        else
          toasts.value = toasts.value.filter((toast) => toast.id !== toastId);

        toast.value = undefined;
      },
    },
  };

  return toast;
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

export interface RefToastInstance {
  value?: ToastInstance
}
