import type { H3Event } from 'h3';
import type { QueryObject } from 'ufo';

export async function assertNoOAuthErrors(event: H3Event, _query?: QueryObject) {
  // Can't delete the cookie here, because user might need to enter a username
  // which is done later, with separate check
  // deleteCookie(event, 'state');

  const query = _query || getQuery(event)!;

  if (query.error) {
    deleteCookie(event, 'state');

    await event.context.logger.error({ err: new Error(query.error.toString()), msg: 'oauth failed' });

    throw createError({ statusCode: 418, message: decodeURIComponent(query.error.toString()) });
  }

  if (typeof query.state !== 'string' || query.state !== getCookie(event, 'state')) {
    deleteCookie(event, 'state');

    const identifier = getRequestIP(event, { xForwardedFor: true });

    await event.context.logger.error({ msg: 'someone is messing with authentication', identifier });

    throw createError({ statusCode: 422 });
  }
}
