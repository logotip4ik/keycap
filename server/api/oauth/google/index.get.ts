import { destr } from 'destr';
import { withQuery } from 'ufo';

import type { GoogleUserRes } from '~/types/server-google';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

  const query = getQuery(event);

  await assertNoOAuthErrors(event);

  if (!query.code)
    return await sendOAuthRedirect(event, OAuthProvider.Google);

  const googleUser: GoogleUserRes | undefined = destr<GoogleUserRes>(query.socialUser) || await getGoogleUserWithEvent(event)
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'getGoogleUserWithEvent failed' });
    });

  const userValidation = useSocialUserValidator(googleUser);

  if (!userValidation.ok) {
    await event.context.logger.error({ err: userValidation.errors, msg: 'social user validation failed' });

    return await sendRedirect(event, '/');
  }

  const prisma = getPrisma();

  if (!query.socialUser) {
    const userSelect = { id: true, email: true, username: true };

    const [oauth, dbUser] = await Promise.all([
      prisma.oAuth.findFirst({
        where: { id: googleUser.id },
        select: { user: { select: userSelect } },
      }),

      prisma.user.findFirst({
        where: { email: googleUser.email },
        select: userSelect,
      }),
    ]);

    user = oauth?.user || dbUser || null;
  }

  let username: string;

  if (user) {
    username = user.username;
  }
  else {
    username = query.username?.toString().trim() || '';

    const validation = useUsernameValidator(username);
    const isUsernameValid = validation.ok && !(await checkIfUsernameTakenCached(username!));

    if (!isUsernameValid) {
      query.provider = OAuthProvider.Google;
      query.username = undefined;
      query.socialUser = googleUser;
      query.usernameTaken = validation.ok && await checkIfUsernameTakenCached(username!) ? username : '';

      return await sendRedirect(event, withQuery('/oauth/ask-username', query));
    }
  }

  // clear oauth state cookie
  deleteCookie(event, 'state');

  user = await updateOrCreateUserFromSocialAuth(
    normalizeGoogleUser(googleUser, { username }),
  )
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'updateOrCreateUserFromSocialAuth failed' });

      return null;
    });

  if (!user)
    return await sendRedirect(event, '/');

  await Promise.all([
    setAuthCookies(event, user),
    removeFunctionCache(`${username}-taken`),
  ]);

  return await sendRedirect(event, `/@${user.username}`);
});
