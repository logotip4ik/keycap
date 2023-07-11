export default defineEventHandler(async (event) => {
  const code = getQuery(event).code;

  if (!code)
    return sendGitHubOAuthRedirect(event);

  const githubUser = await getGitHubUserWithEvent(event)
    .catch(() => null);

  if (!githubUser)
    return sendRedirect(event, '/');

  const user = await getOrCreateUserFromSocialAuth(githubUser)
    .catch(() => null);

  // TODO: better error handling
  if (!user)
    return sendRedirect(event, '/');

  await setAuthCookies(event, user);

  return sendRedirect(event, `/@${user.username}`);
});
