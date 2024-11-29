import type { H3Error } from 'h3';

export function sendError(error: Error, properties?: Record<string, string | boolean | undefined>) {
  const payload = {
    type: LogLevel.Error,
    payload: {
      ...error,

      distinct_id: import.meta.prod ? 'Keycap' : 'Keycap Dev',
      name: error.name,
      msg: error.message,
      stack: error.stack,
      // @ts-expect-error in case status code exists send it
      statusCode: error.statusCode,
    } as Record<string, string>,
  };

  if (properties) {
    extend(payload.payload, properties);
  }

  if (import.meta.server) {
    const event = useRequestEvent()!;

    return logger.error(event, payload);
  }
  else {
    payload.payload.clientPath = window.location.pathname;

    return kfetch('/_log', {
      method: 'POST',
      body: payload,
      ignoreResponseError: true,
      keepalive: true,
    });
  }
}

export async function baseHandleError(error: Error | H3Error): Promise<boolean> {
  const user = useUser();
  const isFallbackMode = useFallbackMode();

  if (error.message.includes('aborted')) {
    return true;
  }

  if ('statusCode' in error) {
    if (error.statusCode === 401 || !user.value) {
      user.value = undefined;

      if (import.meta.client) {
        window.location.pathname = '/login';
      }
      else {
        await navigateTo('/login');
      }

      return true;
    }

    if (error.statusCode === 404) {
      const hydrationPromise = getHydrationPromise();

      if (hydrationPromise) {
        await hydrationPromise.then(async () => {
          await navigateTo(`/@${user.value!.username}`);
        });
      }
      else {
        await navigateTo(`/@${user.value.username}`);
      }

      return true;
    }
  }

  // Other network error ?
  if (error.name === 'FetchError') {
    sendError(error); // Try to send the error
    isFallbackMode.value = true;
  }

  return false;
};
