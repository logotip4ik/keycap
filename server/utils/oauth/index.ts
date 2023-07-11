import { SocialAuth } from '@prisma/client';

import type { Prisma } from '@prisma/client';

import type { SafeUser } from '../../../types/server';
import type { GitHubUserRes } from './github';
import type { GoogleUserRes } from './google';

export interface NormalizedUser {
  email: string
  username: string
}

export async function getOrCreateUserFromSocialAuth(socialAuth: GitHubUserRes | GoogleUserRes) {
  const prisma = getPrisma();

  const socialId = socialAuth.id.toString();
  const socialType = typeof (socialAuth as GitHubUserRes).login === 'undefined'
    ? SocialAuth.Google
    : SocialAuth.GitHub;

  const social: Prisma.OAuthCreateWithoutUserInput = {
    id: socialId,
    type: socialType,
  };

  const normalizedUser = socialType === SocialAuth.GitHub
    ? transformGitHubUser(socialAuth as GitHubUserRes)
    : transformGoogleUser(socialAuth as GoogleUserRes);

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
              where: { id: socialId },
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

export function transformGoogleUser(googleUser: GoogleUserRes): NormalizedUser {
  return {
    username: googleUser.email.split('@')[0],
    email: googleUser.email,
  };
}

export function transformGitHubUser(githubUser: GitHubUserRes): NormalizedUser {
  return {
    username: githubUser.login,
    email: githubUser.email,
  };
}
