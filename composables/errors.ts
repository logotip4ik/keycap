import parseDuration from 'parse-duration'

export function setupErrorHandling() {
  // TODO: use server logger ?
  if (import.meta.server)
    return;


  onErrorCaptured((e) => sendError(e));
}

export function sendError(error: Error, properties?: Record<string, string>) {
  const { errors } = useRuntimeConfig().public;

  const payload = {
    api_key: errors.apiKey,
    distinct_id: import.meta.env.PROD ? 'Keycap' : 'Keycap Dev',
    properties: {
      name: error.name,
      msg: error.message,
      // @ts-expect-error in case status code exists send it
      statusCode: error.statusCode,
      // https://github.com/PostHog/posthog-js-lite/blob/master/posthog-core/src/index.ts#L680
      $session_id: getSessionId(),
    },
    event: "$event"
  }

  if (properties)
    Object.assign(payload.properties, properties);

  // if (import.meta.env.PROD)
    navigator.sendBeacon(errors.url, JSON.stringify(payload));
  // else
  //   console.log(payload)
} 

function getSessionId() {
  const key = 'device-identifier'
  let id = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(key))
    ?.split('=')[1] as string | undefined;

  if (id)
    return id;

  id = crypto.randomUUID();

  document.cookie = `${key}=${id}; Max-Age=${parseDuration('0.5year', 's')}; Path=/; Secure; SameSite=Lax`;
  
  return id
}
