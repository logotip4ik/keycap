import { withQuery } from 'ufo';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

  const query = getQuery(event);

  if (!query.code || !query.state)
    return sendOAuthRedirect(event, OAuthProvider.GitHub);

  if (query.state !== getCookie(event, 'state'))
    return createError({ statusCode: 422 });

  const username = query.username?.toString().trim();

  if (!username || username.length < 3) {
    query.provider = OAuthProvider.Google.toLowerCase();
    query.username = undefined;

    return sendRedirect(event,
      withQuery('/oauth/ask-username', query),
    );
  }

  const githubUser = await getGitHubUserWithEvent(event)
    .catch(() => null);

  // TODO: better error handling
  if (!githubUser)
    return sendRedirect(event, '/');

  user = await getOrCreateUserFromSocialAuth(
    normalizeGitHubUser(githubUser, { username }),
  )
    .catch(() => null);

  // TODO: better error handling
  if (!user)
    return sendRedirect(event, '/');

  await setAuthCookies(event, user);

  return sendRedirect(event, `/@${user.username}`);
});
