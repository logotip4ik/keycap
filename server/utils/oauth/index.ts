import { randomUUID } from 'node:crypto';
import { isProduction } from 'std-env';
import { withQuery } from 'ufo';
import parseDuration from 'parse-duration';

import type { Prisma } from '@prisma/client';
import type { H3Event } from 'h3';

import { OAuthProvider } from '~/server/utils';

import type { NormalizedSocialUser, OAuthProvider as OAuthProviderType, SafeUser } from '~/types/server';

export async function assertNoOAuthErrors(event: H3Event) {
  const proviersMap = {
    '/api/oauth/github': OAuthProvider.GitHub,
    '/api/oauth/google': OAuthProvider.Google,
  };

  const pathWithoutQuery = event.path.split('?')[0];

  const provider = proviersMap[pathWithoutQuery as keyof typeof proviersMap];

  if (!provider) {
    // path is set by logger
    await event.context.logger.error({ msg: 'undefined provider' });

    throw createError({ statusCode: 418, statusMessage: 'i a coffeepot' });
  }

  const query = getQuery(event);

  if (query.error) {
    await event.context.logger.error({ err: query.error, msg: 'oauth failed' });

    throw createError({ statusCode: 418, statusMessage: decodeURIComponent(query.error.toString()) });
  }

  if (query.state !== getCookie(event, 'state')) {
    const identifier = getHeader(event, 'x-real-ip')
      || getHeader(event, 'client-ip')
      || getHeader(event, 'x-forwarded-for');

    await event.context.logger.error({ msg: 'someone is messing with authentication', identifier });

    throw createError({ statusCode: 422 });
  }

  deleteCookie(event, 'state');
}

export function sendOAuthRedirect(event: H3Event, provider: OAuthProviderType) {
  const { google, github, public: config } = useRuntimeConfig(event);

  const state = randomUUID();
  const protocol = isProduction ? 'https://' : 'http://';

  setCookie(event, 'state', state, {
    path: '/',
    httpOnly: true,
    maxAge: parseDuration('0.75 hour', 's'),
  });

  let url: string;
  const oauthOptions: any = {
    state,
    client_id: '',
    scope: '',
    redirect_uri: `${protocol}${config.siteOrigin}/api/oauth/${provider.toLowerCase()}`,
  };

  if (provider === OAuthProvider.GitHub) {
    url = 'https://github.com/login/oauth/authorize';

    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
    oauthOptions.client_id = github.clientId;
    oauthOptions.scope = 'user:email';
  }
  else if (provider === OAuthProvider.Google) {
    url = 'https://accounts.google.com/o/oauth2/v2/auth';

    // https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
    oauthOptions.client_id = google.clientId;
    oauthOptions.scope = 'email';

    oauthOptions.response_type = 'code';
    oauthOptions.access_type = 'online';
    oauthOptions.prompt = 'select_account';
  }
  else {
    throw new Error(`incorrect provider option: ${provider}`);
  }

  return sendRedirect(event,
    withQuery(url, oauthOptions),
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
      where: { email: normalizedUser.email },
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
