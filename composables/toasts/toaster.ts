import type { ShallowRef } from 'vue';

export type RefToastInstance = ShallowRef<ToastInstance | null | undefined>;
export type ToastUserOptions = Partial<Omit<ToastInstance, 'id' | 'message' | 'remove' | 'el' | 'delete'>>;

const toasts = shallowRef<Array<ToastInstance>>([]);
export const useToasts = () => toasts;

function createToastRef(message: ToastInstance['message'], options?: ToastUserOptions & { delay?: number }): RefToastInstance {
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

export function useToaster() {
  return createToastRef;
}

function createToast(options: ToastUserOptions & { message: ToastInstance['message'], timeout: { value: NodeJS.Timeout | null } }): RefToastInstance {
  if (unref(options.message).trim() === '')
    throw new Error('no message was provided');

  const toastId = Math.floor(Math.random() * 9999999);

  // TODO: refactor this to class
  const toast: RefToastInstance = shallowRef(
    new Toast({
      ...options,

      id: toastId,
      message: options.message,
      remove: () => {
        if (options.timeout.value)
          clearTimeout(options.timeout.value);
        else
          toasts.value = toasts.value.filter((toast) => toast.id !== toastId);

        toast.value = undefined;
      },
    }),
  );

  return toast;
}
