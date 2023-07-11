import { randomUUID } from 'node:crypto';
import { isProduction } from 'std-env';
import { withQuery } from 'ufo';

import type { H3Event } from 'h3';

import type { NormalizedSocialUser } from '~/types/server';
import type { GoogleAuthRes, GoogleUserRes } from '~/types/server-google';

export function normalizeGoogleUser(googleUser: GoogleUserRes): NormalizedSocialUser {
  return {
    id: googleUser.id,
    username: googleUser.email.split('@')[0],
    email: googleUser.email,
    type: OAuthProvider.Google,
  };
}

export function sendGoogleOAuthRedirect(event: H3Event) {
  const { google, public: config } = useRuntimeConfig();

  const state = randomUUID();
  const protocol = isProduction ? 'https://' : 'http://';

  setCookie(event, 'state', state);

  return sendRedirect(event,
    withQuery('https://accounts.google.com/o/oauth2/v2/auth', {
      state,
      client_id: google.clientId,
      redirect_uri: `${protocol}${config.siteOrigin}/api/oauth/google`,
      response_type: 'code',
      access_type: 'online',
      prompt: 'select_account',
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    }),
  );
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

  const user = await $fetch<GoogleUserRes>('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `${auth.token_type} ${auth.access_token}`,
      Accept: 'application/json',
    },
  });

  return user;
}
