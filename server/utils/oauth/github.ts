import type { H3Event } from 'h3';

import type { NormalizedSocialUser } from '~/types/server';
import type { GitHubAuthRes, GitHubUserEmailRes, GitHubUserRes } from '~/types/server-github';

interface NormalizationParams { username: string }
export function normalizeGitHubUser(githubUser: GitHubUserRes, params: NormalizationParams): NormalizedSocialUser {
  return {
    id: githubUser.id.toString(),
    email: githubUser.email,
    username: params.username,
    type: OAuthProvider.GitHub,
  };
}

export async function getGitHubUserWithEvent(event: H3Event) {
  const { github } = useRuntimeConfig(event);
  const code = getQuery(event).code;

  if (!code)
    throw new Error('no code was found');

  const auth = await $fetch<GitHubAuthRes>('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    query: {
      code,
      client_id: github.clientId,
      client_secret: github.clientSecret,
    },
  });

  const apiAuthHeaders = {
    'Authorization': `${auth.token_type} ${auth.access_token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Accept': 'application/vnd.github+json',
    'User-Agent': getServerUserAgent(),
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

    if (!primaryEmail)
      throw new Error('was not able to gather user email');

    user.email = primaryEmail.email;
  }

  return user;
}
