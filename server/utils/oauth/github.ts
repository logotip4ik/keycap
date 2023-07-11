import { randomUUID } from 'node:crypto';
import { isProduction } from 'std-env';
import { withQuery } from 'ufo';

import type { H3Event } from 'h3';

export interface GitHubAuthRes {
  access_token: string
  scope: string
  token_type: string
}

export interface GitHubUserRes {
  id: number
  login: string
  name: string
  email: string
}

export interface GitHubUserEmailRes {
  email: string
  primary: boolean
  verified: boolean
  visibility: string
}

export function sendGitHubOAuthRedirect(event: H3Event) {
  const { github, public: config } = useRuntimeConfig();

  const state = randomUUID();
  const protocol = isProduction ? 'https://' : 'http://';

  setCookie(event, 'state', state);

  return sendRedirect(event,
    withQuery('https://github.com/login/oauth/authorize', {
      state,
      client_id: github.clientId,
      redirect_uri: `${protocol}${config.siteOrigin}/api/oauth/github`,
      scope: 'user:email',
    }),
  );
}

export async function getGitHubUserWithEvent(event: H3Event) {
  const { github } = useRuntimeConfig();
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
    'User-Agent': `Keycap${isProduction ? '' : ' Dev'}`,
  };

  const user = await $fetch<GitHubUserRes>(
    'https://api.github.com/user',
    { headers: apiAuthHeaders },
  );

  if (!user.email) {
    const emails = await $fetch<GitHubUserEmailRes[]>(
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
