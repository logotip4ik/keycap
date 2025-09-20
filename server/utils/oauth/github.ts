import type { NormalizedSocialUser } from '#server/types/server';
import type { GitHubAuthRes, GitHubUserEmailRes, GitHubUserRes } from '#server/types/server-github';

import type { H3Event } from 'h3';

import invariant from 'tiny-invariant';

export function getGithubOAuthConfig(): OAuthProviderConfig {
  const { github } = useRuntimeConfig();

  // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
  return {
    oauth: github,
    name: oAuthProvider.GitHub,
    scope: 'user:email',
    authorizeEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
  };
}

interface NormalizationParams { username: string }
export function normalizeGitHubUser(githubUser: GitHubUserRes, params: NormalizationParams): NormalizedSocialUser {
  return {
    id: githubUser.id.toString(),
    email: githubUser.email,
    username: params.username,
    type: 'GitHub',
  };
}

export async function getGitHubUserWithEvent(event: H3Event) {
  const code = getQuery(event).code;

  invariant(code, '`code` wasn\'t found');

  const config = getGithubOAuthConfig();
  const { public: { site } } = useRuntimeConfig();

  const auth = await $fetch<GitHubAuthRes>(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    query: {
      code,
      client_id: config.oauth.clientId,
      client_secret: config.oauth.clientSecret,
      redirect_uri: `${defaultProtocol}${site}/api/oauth/github`,
    },
  });

  const apiAuthHeaders = {
    'Authorization': `${auth.token_type} ${auth.access_token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Accept': 'application/vnd.github+json',
    'User-Agent': serverUserAgent,
  };

  const user = await $fetch<GitHubUserRes>(
    'https://api.github.com/user',
    { headers: apiAuthHeaders },
  );

  if (!user.email) {
    const emails = await $fetch<Array<GitHubUserEmailRes>>(
      'https://api.github.com/user/emails',
      { headers: apiAuthHeaders },
    );

    const primaryEmail = emails.find((email) => email.primary) || emails[0];

    invariant(primaryEmail, 'unable to gather user email');

    user.email = primaryEmail.email;
  }

  return user;
}
