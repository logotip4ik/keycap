import { destr } from 'destr';
import { withQuery } from 'ufo';

import type { GoogleUserRes } from '~/types/server-google';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

  const query = getQuery(event);

  // TODO: check this in `assertNoOAuthErrors` because code may not be present with error response
  if (!query.code)
    return sendOAuthRedirect(event, OAuthProvider.Google);

  await assertNoOAuthErrors(event);

  const googleUser = destr<GoogleUserRes>(query.socialUser) || await getGoogleUserWithEvent(event)
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'getGoogleUserWithEvent failed' });
    });

  const userValidation = useSocialUserValidator(googleUser);

  if (!userValidation.ok) {
    await event.context.logger.error({ err: userValidation.errors, msg: 'social user validation failed' });

    return sendRedirect(event, '/');
  }

  const prisma = getPrisma();

  if (!query.socialUser) {
    user = await prisma.user.findFirst({
      where: { email: googleUser.email },
      select: { id: true, email: true, username: true },
    }).catch(async (err) => {
      await event.context.logger.error({ err, msg: 'user.findFirst failed' });

      return null;
    });

    if (user) {
      await setAuthCookies(event, user);

      return sendRedirect(event, `/@${user.username}`);
    }
  }

  const username = query.username?.toString().trim();
  const isUsernameValid = useUsernameValidator(username).ok
    && !(await checkIfUsernameTaken(username!));

  if (!isUsernameValid) {
    query.provider = OAuthProvider.Google.toLowerCase();
    query.username = undefined;
    query.socialUser = googleUser;
    query.usernameTaken = await checkIfUsernameTaken(username!) ? username : '';

    return sendRedirect(event,
      withQuery('/oauth/ask-username', query),
    );
  }

  user = await updateOrCreateUserFromSocialAuth(
    normalizeGoogleUser(googleUser, { username: username! }),
  )
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'updateOrCreateUserFromSocialAuth failed' });

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
