export default defineOAuthHandler({
  getOAuthConfig: (_event) => getGithubOAuthConfig(),
  getOAuthUser: (event) => {
    return getGitHubUserWithEvent(event)
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'getGitHubUserWithEvent failed' });
        return undefined;
      });
  },
  normalizeOAuthUser: (user, overwrites) => {
    return normalizeGitHubUser(user, overwrites);
  },
});
