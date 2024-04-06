import type { H3Error } from 'h3';

export function setupErrorLogging() {
  // TODO: use server logger ?
  if (import.meta.server) {
    return;
  }

  onErrorCaptured((e) => sendError(e));
}

export function sendError(error: Error, properties?: Record<string, string>) {
  const { errors } = useRuntimeConfig().public;

  const payload = {
    api_key: errors.apiKey,
    distinct_id: import.meta.prod ? 'Keycap' : 'Keycap Dev',
    properties: {
      name: error.name,
      msg: error.message,
      // @ts-expect-error in case status code exists send it
      statusCode: error.statusCode,
      // https://github.com/PostHog/posthog-js-lite/blob/master/posthog-core/src/index.ts#L680
      $session_id: getSessionId(),
    },
    event: '$event',
  };

  if (properties) {
    extend(payload.properties, properties);
  }

  if (import.meta.prod) {
    navigator.sendBeacon(errors.url, JSON.stringify(payload));
  }
  else {
    console.log(payload); // eslint-disable-line no-console
  }
}

export async function baseHandleError(error: Error | H3Error): Promise<boolean> {
  const user = useUser();
  const isFallbackMode = useFallbackMode();

  if (error.message.includes('aborted')) {
    return true;
  }

  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 401 || !user.value) {
    user.value = undefined;
    await navigateTo('/login');
    return true;
  }

  // @ts-expect-error there actually is statusCode
  if (error.statusCode === 404) {
    await navigateTo(`/@${user.value.username}`);
    return true;
  }

  // Other network error ?
  if (error.name === 'FetchError') {
    sendError(error); // Try to send the error
    isFallbackMode.value = true;
  }

  return false;
};

function getSessionId() {
  const key = 'device-identifier';
  let id = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(key))
    ?.split('=')[1] as string | undefined;

  if (id) {
    return id;
  }

  id = crypto.randomUUID();

  document.cookie = `${key}=${id}; Max-Age=${parseDuration('0.5year', 's')}; Path=/; Secure; SameSite=Lax`;

  return id;
}
