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
      await logger.error(event, { err, msg: 'getGoogleUserWithEvent failed' });
    });

  const userValidation = useSocialUserValidator(googleUser);

  if (!userValidation.ok) {
    await logger.error(event, {
      errors: userValidation.errors,
      msg: 'social user validation failed',
    });

    return await sendRedirect(event, '/');
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
          eb('OAuth.type', '=', OAuthProvider.Google),
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

    const validation = useUsernameValidator(username);
    const isUsernameValid = validation.ok && !(await checkIfUsernameTaken(event, username!));

    if (!isUsernameValid) {
      query.provider = OAuthProvider.Google;
      query.username = undefined;
      query.socialUser = googleUser;
      query.usernameTaken = validation.ok && await checkIfUsernameTaken(event, username!) ? username : '';

      return await sendRedirect(event, withQuery('/oauth/ask-username', query));
    }

    await updateCacheEntry(getUserCacheKey(username, UserCacheName.Taken), true);
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

  deleteCookie(event, 'state');

  if (!user)
    return await sendRedirect(event, '/');

  await setAuthCookies(event, user);

  return await sendRedirect(event, `/@${user.username}`);
});
