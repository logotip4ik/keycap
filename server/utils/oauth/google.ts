import type { H3Event } from 'h3';

import type { OAuthProviderConfig } from '~/types/oauth';
import type { NormalizedSocialUser } from '~/types/server';
import type { GoogleAuthRes, GoogleUserRes } from '~/types/server-google';

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
    type: OAuthProvider.Google,
  };
}

export async function getGoogleUserWithEvent(event: H3Event) {
  const code = getQuery(event).code;

  if (!code)
    throw new Error('no code was found');

  const protocol = import.meta.prod ? 'https://' : 'http://';

  const auth = await $fetch<GoogleAuthRes>(config.tokenEndpoint, {
    method: 'POST',
    body: {
      code,
      client_id: config.oauth.clientId,
      client_secret: config.oauth.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: `${protocol}${useRuntimeConfig().public.site}/api/oauth/google`,
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
