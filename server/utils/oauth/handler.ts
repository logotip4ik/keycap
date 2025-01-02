import type { NormalizedSocialUser } from '#server/types/server';
import type { GitHubUserRes } from '#server/types/server-github';
import type { GoogleUserRes } from '#server/types/server-google';

import type { H3Event } from 'h3';

import { withQuery } from 'ufo';

interface OAuthHandlerOptions<T extends GitHubUserRes | GoogleUserRes> {
  getOAuthConfig: (event: H3Event) => OAuthProviderConfig
  getOAuthUser: (event: H3Event) => Promise<T | void>
  normalizeOAuthUser: (user: T, overwrites: { username: string }) => NormalizedSocialUser
}

export function defineOAuthHandler<T extends GitHubUserRes | GoogleUserRes>({
  getOAuthConfig,
  getOAuthUser,
  normalizeOAuthUser,
}: OAuthHandlerOptions<T>) {
  return defineEventHandler(async (event) => {
    let user = event.context.user;

    if (user) {
      return sendRedirect(event, `/@${user.username}`);
    }

    const query = getQuery(event);
    const config = getOAuthConfig(event);

    // This means that user was redirected here to actually sign in
    // with social account, so this technically is not an error
    if (
      sendOAuthRedirectIfNeeded({
        event,
        query,
        config,
      })
    ) {
      return;
    }

    const oAuthStateKey = await assertNoOAuthErrors(event, query);

    const oAuthUserCache = getOAuthUserCache();

    let gotOAuthUserFromCache = true;
    let oAuthUser = await oAuthUserCache.getItem<T>(oAuthStateKey) || undefined;
    if (!oAuthUser) {
      oAuthUser = await getOAuthUser(event) || undefined;
      gotOAuthUserFromCache = false;
    }

    const error = socialUserValidator.Errors(oAuthUser).First();

    if (error) {
      await logger.error(event, {
        ...error,
        msg: error.message,
      });

      return sendRedirect(event, '/');
    }

    invariant(oAuthUser, 'Social user validation is not ok.');

    await oAuthUserCache.setItem(
      oAuthStateKey,
      oAuthUser,
      { ttl: parseDuration('5 minutes', 's')! },
    );

    if (!gotOAuthUserFromCache) {
      const kysely = getKysely();

      user = await kysely
        .selectFrom('User')
        .leftJoin('OAuth', 'OAuth.userId', 'User.id')
        .where((eb) => eb.or([
          eb('User.email', '=', oAuthUser.email),
          eb.and([
            eb('OAuth.id', '=', `${oAuthUser.id}`),
            eb('OAuth.type', '=', config.name),
          ]),
        ]))
        .select(['User.id', 'User.email', 'User.username'])
        .executeTakeFirst()
        .catch(async (err) => {
          await logger.error(event, { err, msg: `oauth.${config.name.toLowerCase()}.findUser failed` });
          return undefined;
        });
    }

    let username: string;

    if (user) {
      username = user.username;
    }
    else {
      username = query.username?.toString().trim() || '';

      const isUsernameValid = usernameValidator.Check(username);
      // short-circuiting to prevent checking not valid username
      const isUsernameTaken = isUsernameValid && await checkIfUsernameTaken(event, username);

      if (!isUsernameValid || isUsernameTaken) {
        query.provider = config.name;
        query.username = undefined;
        query.usernameTaken = isUsernameValid && isUsernameTaken ? username : undefined;

        // NOTE: this basically makes infinite loop
        // to force user to input correct username
        return sendRedirect(event, withQuery('/oauth/ask-username', query));
      }
    }

    await Promise.all([
      oAuthUserCache.removeItem(oAuthStateKey),
      invalidateCacheEntry(getUserCacheKey(username, UserCacheName.Taken)),
    ]);

    const normalizedOAuthUser = normalizeOAuthUser(oAuthUser, { username });

    if (user) {
      await updateUserWithSocialAuth(user.id, normalizedOAuthUser)
        .catch(async (err) => {
          await logger.error(event, { err, msg: `oauth.${config.name.toLowerCase()}.updateUser failed` });

          return undefined;
        });
    }
    else {
      user = await createUserWithSocialAuth(normalizedOAuthUser)
        .catch(async (err) => {
          await logger.error(event, { err, msg: `oauth.${config.name.toLowerCase()}.createUser failed` });

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
}
