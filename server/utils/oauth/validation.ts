import type { H3Event } from 'h3';
import type { QueryObject } from 'ufo';

export async function assertNoOAuthErrors(event: H3Event, query: QueryObject) {
  // Can't delete the cookie here, because user might need to enter a username
  // which is done later, with separate check
  // deleteCookie(event, 'state');

  if (query.error) {
    deleteOAuthStateCookie(event);

    await logger.error(event, { err: new Error(query.error.toString()), msg: 'oauth failed' });

    throw createError({ status: 418, message: decodeURIComponent(query.error.toString()) });
  }

  const stateCookie = getCookie(event, 'state');
  if (typeof query.state !== 'string' || query.state !== stateCookie) {
    deleteOAuthStateCookie(event);

    const identifier = getRequestIP(event, { xForwardedFor: true });

    await logger.error(event, {
      msg: 'someone is messing with authentication',
      identifier,
      stateCookie,
    });

    throw createError({ status: 422 });
  }
}
