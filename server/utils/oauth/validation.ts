import type { H3Event } from 'h3';

const providersMap = {
  '/api/oauth/github': OAuthProvider.GitHub,
  '/api/oauth/google': OAuthProvider.Google,
};

export async function assertNoOAuthErrors(event: H3Event) {
  deleteCookie(event, 'state');

  const pathWithoutQuery = event.path.split('?')[0];

  const provider = providersMap[pathWithoutQuery as keyof typeof providersMap];

  if (!provider) {
    await event.context.logger.error({ msg: 'undefined provider' });

    throw createError({ statusCode: 418, message: 'i a coffeepot' });
  }

  const query = getQuery(event);

  if (query.error) {
    await event.context.logger.error({ err: new Error(query.error.toString()), msg: 'oauth failed' });

    throw createError({ statusCode: 418, message: decodeURIComponent(query.error.toString()) });
  }

  if (typeof query.state === 'string' && query.state !== getCookie(event, 'state')) {
    const identifier = getRequestIP(event, { xForwardedFor: true });

    await event.context.logger.error({ msg: 'someone is messing with authentication', identifier });

    throw createError({ statusCode: 422 });
  }
}
