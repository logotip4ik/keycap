import proxy from 'unenv/runtime/mock/proxy';

import type { ToastInstance } from '~/types/toasts';

export type ToastUserOptions = Partial<Omit<ToastInstance, 'id' | 'message' | 'remove' | 'el' | 'delete'>>;

const toasts = shallowRef<Array<ToastInstance>>([]);
export function useToasts(): typeof toasts {
  if (import.meta.server) {
    return proxy;
  }

  return toasts;
}

function addToQueue(message: ToastInstance['message'], options?: ToastUserOptions & { delay?: number }): ToastInstance {
  const timeout: { value: NodeJS.Timeout | undefined } = { value: undefined };

  const toast = createToast({ ...options, message, timeout });

  const addToastToQueue = () => {
    timeout.value = undefined;
    toasts.value = toasts.value.concat(toast);
  };

  if (options?.delay) {
    timeout.value = setTimeout(addToastToQueue, options.delay);
  }
  else {
    addToastToQueue();
  }

  return toast;
};

export function useToaster() {
  return addToQueue;
}

function createToast(options: ToastUserOptions & { message: ToastInstance['message'], timeout: { value: NodeJS.Timeout | undefined } }): ToastInstance {
  if (unref(options.message).trim() === '') {
    throw new Error('no message was provided');
  }

  const toastId = Math.floor(Math.random() * 9999999);

  return {
    id: toastId,
    message: options.message,
    remove: () => {
      if (options.timeout.value) {
        clearTimeout(options.timeout.value);
      }
      else {
        toasts.value = toasts.value.filter((toast) => toast.id !== toastId);
      }
    },

    priority: options.priority || 0,
    duration: options.duration || 6000,
    type: options.type || 'info',
    buttons: options.buttons || [],
    el: shallowRef(null),
  };
}
