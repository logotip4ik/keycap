export default defineEventHandler(async (event) => {
  const { code, state } = getQuery(event);

  if (!code || !state)
    return sendOAuthRedirect(event, OAuthProvider.GitHub);

  if (state !== getCookie(event, 'state'))
    return createError({ statusCode: 422 });

  const githubUser = await getGitHubUserWithEvent(event)
    .catch(() => null);

  if (!githubUser)
    return sendRedirect(event, '/');

  const user = await getOrCreateUserFromSocialAuth(
    normalizeGitHubUser(githubUser),
  )
    .catch(() => null);

  // TODO: better error handling
  if (!user)
    return sendRedirect(event, '/');

  await setAuthCookies(event, user);

  return sendRedirect(event, `/@${user.username}`);
});
