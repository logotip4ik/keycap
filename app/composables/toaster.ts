import type { ShallowRef } from 'vue';

import proxy from 'unenv/runtime/mock/proxy';

import type { ToastInstance } from '~/types/toasts';

type ToastUserOptions = Partial<Omit<ToastInstance, 'id' | 'message' | 'remove' | 'el' | 'delete'>>;

const toasts: ShallowRef<Array<ToastInstance>> = import.meta.server ? proxy : /* #__PURE__ */ shallowRef<Array<ToastInstance>>([]);
export function useToasts() {
  return toasts;
}

function addToQueue(message: ToastInstance['message'], options?: ToastUserOptions & { delay?: number }): ToastInstance {
  const timeout: { value: ReturnType<typeof setTimeout> | undefined } = { value: undefined };

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

function createToast(options: ToastUserOptions & {
  message: ToastInstance['message']
  timeout: { value: ReturnType<typeof setTimeout> | undefined }
}): ToastInstance {
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
