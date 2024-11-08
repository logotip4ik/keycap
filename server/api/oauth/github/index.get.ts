import type { GitHubUserRes } from '#server/types/server-github';

import { destr } from 'destr';
import { withQuery } from 'ufo';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user) {
    return sendRedirect(event, `/@${user.username}`);
  }

  const query = getQuery(event);
  const githubOAuthConfig = getGithubOAuthConfig();

  // This means that user was redirected here to actually sign in
  // with social account, so this technically is not an error
  if (
    sendOAuthRedirectIfNeeded({
      event,
      query,
      config: githubOAuthConfig,
    })
  ) {
    return;
  }

  await assertNoOAuthErrors(event, query);

  const githubUser = destr<GitHubUserRes>(query.socialUser) || await getGitHubUserWithEvent(event, githubOAuthConfig)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'getGitHubUserWithEvent failed' });
    });

  const errors = socialUserValidator.Errors(githubUser);
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
        eb('User.email', '=', githubUser.email),
        eb.and([
          eb('OAuth.id', '=', githubUser.id.toString()),
          eb('OAuth.type', '=', oAuthProvider.GitHub),
        ]),
      ]))
      .select(['User.id', 'User.email', 'User.username'])
      .executeTakeFirst()
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'oauth.github.findUser failed' });
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
      query.provider = oAuthProvider.GitHub;
      query.username = undefined;
      query.socialUser = githubUser;
      query.usernameTaken = valid && await checkIfUsernameTaken(event, username) ? username : undefined;

      // NOTE: this basically makes infinite loop
      // to force user to input correct username
      return sendRedirect(event, withQuery('/oauth/ask-username', query));
    }

    await invalidateCacheEntry(getUserCacheKey(username, UserCacheName.Taken));
  }

  const normalizedSocialUser = normalizeGitHubUser(githubUser, { username });

  if (user) {
    await updateUserWithSocialAuth(user.id, normalizedSocialUser)
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'oauth.github.updateUser failed' });

        return undefined;
      });
  }
  else {
    user = await createUserWithSocialAuth(normalizedSocialUser)
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'oauth.github.createUser failed' });

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
