import { destr } from 'destr';
import { withQuery } from 'ufo';

import type { GoogleUserRes } from '~/types/server-google';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

  const query = getQuery(event);
  const prisma = getPrisma();

  if (query.error)
    return sendRedirect(event, '/');

  if (!query.code)
    return sendOAuthRedirect(event, OAuthProvider.Google);

  if (query.state !== getCookie(event, 'state'))
    throw createError({ statusCode: 422 });

  const googleUser = destr<GoogleUserRes>(query.socialUser)
      || await getGoogleUserWithEvent(event).catch(() => null);

  // TODO: better error handling
  if (!googleUser)
    return sendRedirect(event, '/');

  // TODO: better error handling
  if (!googleUser || !googleUser.id || !googleUser.email)
    return sendRedirect(event, '/');

  if (!query.socialUser) {
    user = await prisma.user.findFirst({
      where: { email: googleUser.email },
      select: { id: true, email: true, username: true },
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
  )
    .catch(() => null);

  // TODO: better error handling
  if (!user)
    return sendRedirect(event, '/');

  await Promise.all([
    setAuthCookies(event, user),
    removeFunctionCache(`${username}-taken`),
  ]);

  return sendRedirect(event, `/@${user.username}`);
});
