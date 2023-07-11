import { randomUUID } from 'node:crypto';
import { SocialAuth } from '@prisma/client';
import { isProduction } from 'std-env';
import { withQuery } from 'ufo';

import type { Prisma } from '@prisma/client';
import type { H3Event } from 'h3';

import type { SafeUser } from '../../../types/server';

export interface NormalizedSocialUser {
  id: string
  email: string
  username: string
  type: OAuthProvider
}

export const OAuthProvider = SocialAuth;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];

export function sendOAuthRedirect(event: H3Event, provider: OAuthProvider) {
  const { google, github, public: config } = useRuntimeConfig();

  const state = randomUUID();
  const protocol = isProduction ? 'https://' : 'http://';

  setCookie(event, 'state', state);

  let url: string;
  const baseOptions: any = {
    state,
    client_id: '',
    scope: '',
    redirect_uri: `${protocol}${config.siteOrigin}/api/oauth/${provider.toLowerCase()}`,
  };

  if (provider === SocialAuth.GitHub) {
    url = 'https://github.com/login/oauth/authorize';

    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
    baseOptions.client_id = github.clientId;
    baseOptions.scope = 'user:email';
  }
  else if (provider === SocialAuth.Google) {
    url = 'https://accounts.google.com/o/oauth2/v2/auth';

    // https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
    baseOptions.client_id = google.clientId;
    baseOptions.scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

    baseOptions.response_type = 'code';
    baseOptions.access_type = 'online';
    baseOptions.prompt = 'select_account';
  }
  else {
    throw new Error(`incorrect provider option: ${provider}`);
  }

  return sendRedirect(event,
    withQuery(url, baseOptions),
  );
}

export async function getOrCreateUserFromSocialAuth(normalizedUser: NormalizedSocialUser) {
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
