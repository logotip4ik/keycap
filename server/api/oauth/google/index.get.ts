import { destr } from 'destr';
import { withQuery } from 'ufo';

import type { GoogleUserRes } from '~/types/server-google';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

  const query = getQuery(event);
  const prisma = getPrisma();

  if (query.error) {
    event.context.logger.error({ err: 'google oauth error' }, query.error.toString());

    return sendRedirect(event, '/');
  }

  if (!query.code)
    return sendOAuthRedirect(event, OAuthProvider.Google);

  if (query.state !== getCookie(event, 'state')) {
    event.context.logger.error({ err: 'oauth state mismatch' });

    throw createError({ statusCode: 422 });
  }

  const googleUser = destr<GoogleUserRes>(query.socialUser)
      || await getGoogleUserWithEvent(event).catch((err) => {
        event.context.logger.error({ err }, 'failed to get google user from event');
      });

  // TODO: better error handling
  if (!googleUser || !googleUser.id || !googleUser.email) {
    event.context.logger.error({ err: 'google user missing required properties', user: googleUser || null });

    return sendRedirect(event, '/');
  }

  if (!query.socialUser) {
    user = await prisma.user.findFirst({
      where: { email: googleUser.email },
      select: { id: true, email: true, username: true },
    }).catch((err) => {
      event.context.logger.error({ err }, 'user.findFirst failed');

      return null;
    });

    if (user) {
      await setAuthCookies(event, user);

      return sendRedirect(event, `/@${user.username}`);
    }
  }

  const username = query.username?.toString().trim();
  const isUsernameValid = username && username.length > 3 && !(await checkIfUsernameTaken(username));

  if (!isUsernameValid) {
    query.provider = OAuthProvider.Google.toLowerCase();
    query.username = undefined;
    query.socialUser = googleUser;
    query.usernameTaken = await checkIfUsernameTaken(username) ? username : '';

    return sendRedirect(event,
      withQuery('/oauth/ask-username', query),
    );
  }

  user = await updateOrCreateUserFromSocialAuth(
    normalizeGoogleUser(googleUser, { username }),
  ).catch((err) => {
    event.context.logger.error({ err }, 'failed updating or creating with google user');

    return null;
  });

  if (!user)
    return sendRedirect(event, '/');

  await Promise.all([
    setAuthCookies(event, user),
    removeFunctionCache(`${username}-taken`),
  ]);

  return sendRedirect(event, `/@${user.username}`);
});
