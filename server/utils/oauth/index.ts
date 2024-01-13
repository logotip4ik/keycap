import type { Prisma } from '@prisma/client';
import type { H3Event } from 'h3';

import { OAuthProvider } from '~/server/utils/index';
import { googleConfig } from '~/server/utils/oauth/google';
import { githubConfig } from '~/server/utils/oauth/github';

import type { OAuthProviderConfig } from '~/types/oauth';
import type { NormalizedSocialUser, OAuthProvider as OAuthProviderType, SafeUser } from '~/types/server';

const providersConfig: Record<OAuthProviderType, OAuthProviderConfig> = {
  [OAuthProvider.GitHub]: githubConfig,
  [OAuthProvider.Google]: googleConfig,
};

export function sendOAuthRedirect(event: H3Event, provider: OAuthProviderType) {
  const providerConfig = providersConfig[provider];

  if (!providerConfig)
    throw new Error(`incorrect provider option: ${provider}`);

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
  redirectUrl.searchParams.set('redirect_uri', `${protocol}${site}/api/oauth/${provider.toLowerCase()}`);

  if (providerConfig.options) {
    for (const key of Object.keys(providerConfig.options))
      redirectUrl.searchParams.set(key, providerConfig.options[key]);
  }

  return sendRedirect(event, redirectUrl.toString());
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
