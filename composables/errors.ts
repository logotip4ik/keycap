export function setupErrorHandling() {
  // TODO: use server logger ?
  if (import.meta.server)
    return;


  onErrorCaptured(sendError);
}

export function sendError(error: Error) {
  const { errors } = useRuntimeConfig().public;

  const payload = {
    api_key: errors.apiKey,
    distinct_id: import.meta.env.PROD ? 'Keycap' : 'Keycap Dev',
    properties: {
      name: error.name,
      msg: error.message,
      // @ts-expect-error in case status code exists send it
      statusCode: error.statusCode,
    },
    event: "$event"
  }

  if (import.meta.env.PROD)
    navigator.sendBeacon(errors.url, JSON.stringify(payload));
  else
    console.log(payload)
} 
