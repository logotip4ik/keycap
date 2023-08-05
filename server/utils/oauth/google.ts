import { isProduction } from 'std-env';

import type { H3Event } from 'h3';

import type { NormalizedSocialUser } from '~/types/server';
import type { GoogleAuthRes, GoogleUserRes } from '~/types/server-google';

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
  const { google, public: config } = useRuntimeConfig();
  const code = getQuery(event).code;

  if (!code)
    throw new Error('no code was found');

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
  });

  const apiAuthHeaders = {
    'Authorization': `${auth.token_type} ${auth.access_token}`,
    'Accept': 'application/json',
    'User-Agent': getServerUserAgent(),
  };

  return await $fetch<GoogleUserRes>('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: apiAuthHeaders,
  });
}
