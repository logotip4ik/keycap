import type { GoogleUserRes } from '#server/types/server-google';

import { destr } from 'destr';
import { withQuery } from 'ufo';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user) {
    return sendRedirect(event, `/@${user.username}`);
  }

  const query = getQuery(event);

  if (
    sendOAuthRedirectIfNeeded({
      event,
      query,
      config: googleConfig,
    })
  ) {
    return;
  }

  await assertNoOAuthErrors(event, query);

  const googleUser: GoogleUserRes | undefined = destr<GoogleUserRes>(query.socialUser) || await getGoogleUserWithEvent(event)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'getGoogleUserWithEvent failed' });
    });

  const errors = socialUserValidator.Errors(googleUser);
  const firstError = errors.First();

  if (firstError) {
    await logger.error(event, {
      errors: [firstError, ...errors],
      msg: 'social user validation failed',
    });

    return sendRedirect(event, '/');
  }

  if (!query.socialUser) {
    const kysely = getKysely();

    user = await kysely
      .selectFrom('User')
      .leftJoin('OAuth', 'OAuth.userId', 'User.id')
      .where((eb) => eb.or([
        eb('User.email', '=', googleUser.email),
        eb.and([
          eb('OAuth.id', '=', googleUser.id),
          eb('OAuth.type', '=', oAuthProvider.Google),
        ]),
      ]))
      .select(['User.id', 'User.email', 'User.username'])
      .executeTakeFirst()
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'oauth.google.findUser failed' });
        return undefined;
      });
  }

  let username: string;

  if (user) {
    username = user.username;
  }
  else {
    username = query.username?.toString().trim() || '';

    const valid = usernameValidator.Check(username);
    const isUsernameValid = valid && !(await checkIfUsernameTaken(event, username));

    if (!isUsernameValid) {
      query.provider = oAuthProvider.Google;
      query.username = undefined;
      query.socialUser = googleUser;
      query.usernameTaken = valid && await checkIfUsernameTaken(event, username) ? username : undefined;

      return sendRedirect(event, withQuery('/oauth/ask-username', query));
    }

    await invalidateCacheEntry(getUserCacheKey(username, UserCacheName.Taken));
  }

  const normalizedSocialUser = normalizeGoogleUser(googleUser, { username });

  if (user) {
    await updateUserWithSocialAuth(user.id, normalizedSocialUser)
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'oauth.google.updateUser failed' });

        return undefined;
      });
  }
  else {
    user = await createUserWithSocialAuth(normalizedSocialUser)
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'oauth.google.createUser failed' });

        return undefined;
      });
  }

  deleteOAuthStateCookie(event);

  if (!user) {
    return sendRedirect(event, '/');
  }

  await setAuthCookies(event, user);

  return sendRedirect(event, `/@${user.username}`);
});
