export default defineOAuthHandler({
  getOAuthConfig: (_event) => getGoogleOAuthConfig(),
  getOAuthUser: (event) => {
    return getGoogleUserWithEvent(event)
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'getGitHubUserWithEvent failed' });
      });
  },
  normalizeOAuthUser: (user, overwrites) => {
    return normalizeGoogleUser(user, overwrites);
  },
});
