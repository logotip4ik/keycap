import { randomUUID } from 'node:crypto';
import { withQuery } from 'ufo';

import type { Prisma } from '@prisma/client';
import type { H3Event } from 'h3';

import { OAuthProvider } from '~/server/utils/index';

import type { NormalizedSocialUser, OAuthProvider as OAuthProviderType, SafeUser } from '~/types/server';

const providersCongfig: Record<OAuthProviderType, { url: string, scope: string }> = {
  [OAuthProvider.GitHub]: {
    scope: 'user:email',
    url: 'https://github.com/login/oauth/authorize',
  },
  [OAuthProvider.Google]: {
    scope: 'email',
    url: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
};

export async function assertNoOAuthErrors(event: H3Event) {
  const proviersMap = {
    '/api/oauth/github': OAuthProvider.GitHub,
    '/api/oauth/google': OAuthProvider.Google,
  };

  const pathWithoutQuery = event.path.split('?')[0];

  const provider = proviersMap[pathWithoutQuery as keyof typeof proviersMap];

  if (!provider) {
    deleteCookie(event, 'state');

    await event.context.logger.error({ msg: 'undefined provider' });

    throw createError({ statusCode: 418, statusMessage: 'i a coffeepot' });
  }

  const query = getQuery(event);

  if (query.error) {
    deleteCookie(event, 'state');

    await event.context.logger.error({ err: query.error, msg: 'oauth failed' });

    throw createError({ statusCode: 418, statusMessage: decodeURIComponent(query.error.toString()) });
  }

  if (typeof query.state === 'string' && query.state !== getCookie(event, 'state')) {
    deleteCookie(event, 'state');

    const identifier = getRequestIP(event, { xForwardedFor: true });

    await event.context.logger.error({ msg: 'someone is messing with authentication', identifier });

    throw createError({ statusCode: 422 });
  }
}

export function sendOAuthRedirect(event: H3Event, provider: OAuthProviderType) {
  const providerConfig = providersCongfig[provider];

  if (!providerConfig)
    throw new Error(`incorrect provider option: ${provider}`);

  const { google, github, public: config } = useRuntimeConfig();

  const state = randomUUID();
  const protocol = import.meta.prod ? 'https://' : 'http://';

  setCookie(event, 'state', state, {
    path: '/',
    httpOnly: true,
  });

  const oauthOptions: Record<string, string> = {
    state,

    client_id: '',
    response_type: 'code',
    response_mode: 'query',

    scope: providerConfig.scope,
    redirect_uri: `${protocol}${config.siteOrigin}/api/oauth/${provider.toLowerCase()}`,
  };

  switch (provider) {
    case OAuthProvider.GitHub:
      // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
      oauthOptions.client_id = github.clientId;
      break;
    case OAuthProvider.Google:
      oauthOptions.client_id = google.clientId;
      // https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
      oauthOptions.access_type = 'online';
      break;
    default:
  }

  return sendRedirect(
    event,
    withQuery(providerConfig.url, oauthOptions),
  );
}

export async function updateOrCreateUserFromSocialAuth(normalizedUser: NormalizedSocialUser) {
  const prisma = getPrisma();

  const social: Prisma.OAuthCreateWithoutUserInput = {
    id: normalizedUser.id,
    type: normalizedUser.type,
  };

  const defaultUserSelect: Prisma.UserSelect = { id: true, email: true, username: true };

  const user = await prisma.$transaction(async (tx) => {
    let dbUser = await tx.user.findFirst({
      select: defaultUserSelect,
      where: { username: normalizedUser.username },
    });

    if (dbUser) {
      await tx.user.update({
        select: null,
        where: { id: dbUser.id },
        data: {
          socials: {
            connectOrCreate: {
              where: { id: normalizedUser.id },
              create: social,
            },
          },
        },
      });
    }
    else {
      dbUser = await tx.user.create({
        select: defaultUserSelect,
        data: {
          email: normalizedUser.email,
          username: normalizedUser.username,

          folders: {
            create: {
              name: `${normalizedUser.username}'s workspace`,
              root: true,
              path: generateRootFolderPath(normalizedUser.username),
            },
          },

          socials: { create: social },
        },
      });
    }

    return dbUser;
  });

  return user as SafeUser;
}
