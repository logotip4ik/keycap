import type { ToastInstance } from './toast';

export type ToastUserOptions = Partial<Omit<ToastInstance, 'id' | 'message' | 'remove' | 'el' | 'delete'>>;

const toasts = shallowRef<Array<ToastInstance>>([]);
export const useToasts = () => toasts;

function _createToast(message: ToastInstance['message'], options?: ToastUserOptions & { delay?: number }): ToastInstance {
  const timeout: { value: NodeJS.Timeout | null } = { value: null };

  const toast = createToast({ ...options, message, timeout });

  const addToastToQueue = () => {
    timeout.value = null;
    toasts.value = toasts.value.concat(toast);
  };

  if (options?.delay)
    timeout.value = setTimeout(addToastToQueue, options.delay);
  else
    addToastToQueue();

  return toast;
};

export function useToaster() {
  return _createToast;
}

function createToast(options: ToastUserOptions & { message: ToastInstance['message'], timeout: { value: NodeJS.Timeout | null } }): ToastInstance {
  if (unref(options.message).trim() === '')
    throw new Error('no message was provided');

  const toastId = Math.floor(Math.random() * 9999999);

  return new Toast({
    ...options,

    id: toastId,
    message: options.message,
    remove: () => {
      if (options.timeout.value)
        clearTimeout(options.timeout.value);
      else
        toasts.value = toasts.value.filter((toast) => toast.id !== toastId);
    },
  });
}
