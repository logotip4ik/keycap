import type { Prisma } from '@prisma/client';
import type { H3Event } from 'h3';
import type { QueryObject } from 'ufo';

import type { NormalizedSocialUser, SafeUser } from '~/types/server';

export const providerPathToConfigMap = {
  '/api/oauth/github': githubConfig,
  '/api/oauth/google': googleConfig,
} as const;

export function sendOAuthRedirectIfNeeded(event: H3Event, _query?: QueryObject): boolean {
  const query = _query || getQuery(event)!;

  if (query.error || (query.state && query.code))
    return false;

  const pathWithoutQuery = event.path.split('?')[0] as keyof typeof providerPathToConfigMap;
  const providerConfig = providerPathToConfigMap[pathWithoutQuery];

  if (!providerConfig)
    throw createError({ statusCode: 418, message: 'i a coffeepot' });

  const { site } = useRuntimeConfig().public;

  const state = createKey(KeyPrefix.OAuthState);
  const protocol = import.meta.prod ? 'https://' : 'http://';
  const redirectUrl = new URL(`${providerConfig.authorizeEndpoint}`);

  setCookie(event, 'state', state, {
    path: '/',
    httpOnly: true,
  });

  redirectUrl.searchParams.set('state', state);
  redirectUrl.searchParams.set('client_id', providerConfig.oauth.clientId);
  redirectUrl.searchParams.set('response_type', 'code');
  redirectUrl.searchParams.set('response_mode', 'query');
  redirectUrl.searchParams.set('scope', providerConfig.scope);
  redirectUrl.searchParams.set('redirect_uri', `${protocol}${site}/api/oauth/${providerConfig.name}`);

  if (providerConfig.options) {
    for (const key in providerConfig.options)
      redirectUrl.searchParams.set(key, providerConfig.options[key]);
  }

  sendRedirect(event, redirectUrl.toString());

  return true;
}

export async function updateOrCreateUserFromSocialAuth(user: NormalizedSocialUser): Promise<SafeUser> {
  const prisma = getPrisma();

  const social: Prisma.OAuthCreateWithoutUserInput = {
    id: user.id,
    type: user.type,
  };

  const defaultUserSelect: Prisma.UserSelect = {
    id: true,
    email: true,
    username: true,
  };

  return await prisma.$transaction(async (tx) => {
    let dbUser = await tx.user.findFirst({
      select: defaultUserSelect,
      where: { username: user.username },
    });

    if (dbUser) {
      await tx.user.update({
        select: { email: true },
        where: { id: dbUser.id },
        data: {
          socials: {
            connectOrCreate: {
              where: { id: user.id },
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
          email: user.email,
          username: user.username,

          folders: {
            create: {
              name: `${user.username}'s workspace`,
              root: true,
              path: generateRootFolderPath(user.username),
            },
          },

          socials: { create: social },
        },
      });
    }

    return dbUser;
  });
}
