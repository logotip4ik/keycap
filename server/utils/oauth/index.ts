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

  // This means that user was redirected here to actually sign in
  // with social account, so this technically is not an error
  // if ((!query.code || !query.state) && !query.error)
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
