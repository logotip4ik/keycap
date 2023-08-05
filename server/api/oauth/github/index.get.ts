import { destr } from 'destr';
import { withQuery } from 'ufo';

import type { GitHubUserRes } from '~/types/server-github';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

  const query = getQuery(event);
  const prisma = getPrisma();

  if (query.error) {
    event.context.logger.error({ err: 'github oauth error' }, query.error.toString());

    return sendRedirect(event, '/');
  }

  if (!query.code)
    return sendOAuthRedirect(event, OAuthProvider.GitHub);

  if (query.state !== getCookie(event, 'state')) {
    event.context.logger.error({ err: 'oauth state mismatch' });

    throw createError({ statusCode: 422 });
  }

  const githubUser = destr<GitHubUserRes>(query.socialUser)
    || await getGitHubUserWithEvent(event).catch((err) => {
      event.context.logger.error({ err }, 'failed to get github user from event');
    });

  if (!githubUser || !githubUser.id || !githubUser.email) {
    event.context.logger.error({ err: 'github user missing required properties', user: githubUser || null });

    return sendRedirect(event, '/');
  }

  if (!query.socialUser) {
    user = await prisma.user.findFirst({
      where: { email: githubUser.email },
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
    query.provider = OAuthProvider.GitHub.toLowerCase();
    query.username = undefined;
    query.socialUser = githubUser;
    query.usernameTaken = await checkIfUsernameTaken(username) ? username : '';

    return sendRedirect(event,
      withQuery('/oauth/ask-username', query),
    );
  }

  user = await updateOrCreateUserFromSocialAuth(
    normalizeGitHubUser(githubUser, { username }),
  )
    .catch((err) => {
      event.context.logger.error({ err }, 'failed updating or creating with github user');

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
