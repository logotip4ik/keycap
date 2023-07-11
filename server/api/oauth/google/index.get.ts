export default defineEventHandler(async (event) => {
  const code = getQuery(event).code;

  if (!code)
    return sendGoogleOAuthRedirect(event);

  const googleUser = await getGoogleUserWithEvent(event)
    .catch(() => null);

  // TODO: better error handling
  if (!googleUser)
    return sendRedirect(event, '');

  const user = await getOrCreateUserFromSocialAuth(googleUser)
    .catch(() => null);

  // TODO: better error handling
  if (!user)
    return sendRedirect(event, '/');

  await setAuthCookies(event, user);

  return sendRedirect(event, `/@${user.username}`);
});
