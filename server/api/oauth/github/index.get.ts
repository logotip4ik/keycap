import { isProduction } from 'std-env';
import { withHttps, withQuery } from 'ufo';

interface GitHubAuthRes {
  access_token: string
  scope: string
  token_type: string
}

interface GitHubUserRes {
  login: string
  name: string
  email: string | null
}

interface GitHubUserEmailRes {
  email: string
  primary: boolean
  verified: boolean
  visibility: string
}

export default defineEventHandler(async (event) => {
  const { github } = useRuntimeConfig();
  const code = getQuery(event).code;

  if (!code) {
    let redirectUrl = getRequestURL(event).href;

    if (isProduction)
      redirectUrl = withHttps(redirectUrl);

    return sendRedirect(event,
      withQuery('https://github.com/login/oauth/authorize', {
        client_id: github.clientId,
        redirect_uri: redirectUrl,
        scope: 'user:email',
      }),
    );
  }

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
  }).catch(() => null);

  if (!auth)
    return sendRedirect(event, '/');

  const apiAuthHeaders = {
    'Authorization': `${auth.token_type} ${auth.access_token}`,
    'User-Agent': `Keycap${isProduction ? '' : ' Dev'}`,
  };

  const user = await $fetch<GitHubUserRes>(
    'https://api.github.com/user',
    { headers: apiAuthHeaders },
  ).catch(() => null);

  if (!user)
    return sendRedirect(event, '/');

  if (!user.email) {
    const emails = await $fetch<GitHubUserEmailRes[]>(
      'https://api.github.com/user/emails',
      { headers: apiAuthHeaders },
    ).catch(() => null);

    if (!emails)
      return sendRedirect(event, '/');

    const primaryEmail = emails.find((email) => email.primary);

    if (!primaryEmail)
      return sendRedirect(event, '/');

    user.email = primaryEmail.email;
  }

  return user;
});
