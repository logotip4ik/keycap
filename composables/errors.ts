import type { H3Error } from 'h3';

export function setupErrorLogging() {
  // TODO: use server logger ?
  if (import.meta.server) {
    return;
  }

  onErrorCaptured((e) => sendError(e));
}

export function sendError(error: Error, properties?: Record<string, string>) {
  const payload = {
    type: LogLevel.Info,
    payload: {
      ...error,

      distinct_id: import.meta.prod ? 'Keycap' : 'Keycap Dev',
      name: error.name,
      msg: error.message,
      stack: error.stack,
      // @ts-expect-error in case status code exists send it
      statusCode: error.statusCode,
    },
  };

  if (properties) {
    extend(payload.payload, properties);
  }

  $fetch('/_log', {
    priority: 'low',
    method: 'POST',
    body: payload,
    ignoreResponseError: true,
  });
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
      await navigateTo('/login');
      return true;
    }

    if (error.statusCode === 404) {
      await navigateTo(`/@${user.value.username}`);
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
