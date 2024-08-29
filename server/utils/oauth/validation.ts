import type { H3Event } from 'h3';
import type { QueryObject } from 'ufo';

export async function assertNoOAuthErrors(event: H3Event, _query?: QueryObject) {
  // Can't delete the cookie here, because user might need to enter a username
  // which is done later, with separate check
  // deleteCookie(event, 'state');

  const query = _query || getQuery(event)!;

  if (query.error) {
    deleteOAuthStateCookie(event);

    await logger.error(event, { err: new Error(query.error.toString()), msg: 'oauth failed' });

    throw createError({ status: 418, message: decodeURIComponent(query.error.toString()) });
  }

  if (typeof query.state !== 'string' || query.state !== getCookie(event, 'state')) {
    deleteOAuthStateCookie(event);

    const identifier = getRequestIP(event, { xForwardedFor: true });

    await logger.error(event, { msg: 'someone is messing with authentication', identifier });

    throw createError({ status: 422 });
  }
}
