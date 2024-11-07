import type { NormalizedSocialUser } from '#server/types/server';
import type { GoogleAuthRes, GoogleUserRes } from '#server/types/server-google';

import type { H3Event } from 'h3';

// https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
const config: OAuthProviderConfig = {
  oauth: useRuntimeConfig().google,

  name: 'google',
  scope: 'email',
  authorizeEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export { config as googleConfig };

interface NormalizationParams { username: string }
export function normalizeGoogleUser(googleUser: GoogleUserRes, params: NormalizationParams): NormalizedSocialUser {
  return {
    id: googleUser.id,
    email: googleUser.email,
    username: params.username,
    type: 'Google',
  };
}

export async function getGoogleUserWithEvent(event: H3Event) {
  const code = getQuery(event).code;

  invariant(code, '`code` wasn\'t found');

  const auth = await $fetch<GoogleAuthRes>(config.tokenEndpoint, {
    method: 'POST',
    body: {
      code,
      client_id: config.oauth.clientId,
      client_secret: config.oauth.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: `${defaultProtocol}${useRuntimeConfig().public.site}/api/oauth/google`,
    },
  });

  const apiAuthHeaders = {
    'Authorization': `${auth.token_type} ${auth.access_token}`,
    'Accept': 'application/json',
    'User-Agent': serverUserAgent,
  };

  return $fetch<GoogleUserRes>('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: apiAuthHeaders,
  });
}
