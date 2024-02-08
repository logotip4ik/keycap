import { destr } from 'destr';
import { withQuery } from 'ufo';

import type { GoogleUserRes } from '~/types/server-google';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

  const query = getQuery(event);

  if (sendOAuthRedirectIfNeeded(event, query))
    return;

  await assertNoOAuthErrors(event, query);

  const googleUser: GoogleUserRes | undefined = destr<GoogleUserRes>(query.socialUser) || await getGoogleUserWithEvent(event)
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'getGoogleUserWithEvent failed' });
    });

  const userValidation = useSocialUserValidator(googleUser);

  if (!userValidation.ok) {
    await event.context.logger.error({
      errors: userValidation.errors,
      msg: 'social user validation failed',
    });

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
    const isUsernameValid = validation.ok && !(await checkIfUsernameTaken(username!));

    if (!isUsernameValid) {
      query.provider = OAuthProvider.Google;
      query.username = undefined;
      query.socialUser = googleUser;
      query.usernameTaken = validation.ok && await checkIfUsernameTaken(username!) ? username : '';

      return await sendRedirect(event, withQuery('/oauth/ask-username', query));
    }

    const userCache = useStorage(USER_CACHE_BASE);
    await userCache.setItem(getUserCacheKey(username, UserCacheGroup.Taken), true);
  }

  user = await updateOrCreateUserFromSocialAuth(
    normalizeGoogleUser(googleUser, { username }),
  )
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'updateOrCreateUserFromSocialAuth failed' });

      return null;
    });

  deleteCookie(event, 'state');

  if (!user)
    return await sendRedirect(event, '/');

  setAuthCookies(event, user);

  return await sendRedirect(event, `/@${user.username}`);
});
