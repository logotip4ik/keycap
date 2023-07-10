import { isProduction } from 'std-env';
import { withHttps, withQuery } from 'ufo';

interface GoogleAuthRes {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
  id_token: string
}

interface GoogleUserRes {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export default defineEventHandler(async (event) => {
  const { google, public: config } = useRuntimeConfig();
  const code = getQuery(event).code;

  if (!code) {
    let redirectUrl = getRequestURL(event).href;

    if (isProduction)
      redirectUrl = withHttps(redirectUrl);

    return sendRedirect(event,
      withQuery('https://accounts.google.com/o/oauth2/v2/auth', {
        client_id: google.clientId,
        redirect_uri: redirectUrl,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        access_type: 'offline',
        prompt: 'select_account',
      }),
    );
  }

  const protocol = isProduction ? 'https://' : 'http://';

  const auth = await $fetch<GoogleAuthRes>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: {
      code,
      client_id: google.clientId,
      client_secret: google.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: `${protocol}${config.siteOrigin}/api/oauth/google`,
    },
  }).catch(() => null);

  if (!auth)
    return sendRedirect(event, '/');

  const user = await $fetch<GoogleUserRes>('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `${auth.token_type} ${auth.access_token}`,
      Accept: 'application/json',
    },
  }).catch(() => null);

  if (!user)
    return sendRedirect(event, '/');

  return user;
});
