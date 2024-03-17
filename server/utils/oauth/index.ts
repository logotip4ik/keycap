import { jsonObjectFrom } from 'kysely/helpers/postgres';

import type { H3Event } from 'h3';
import type { QueryObject } from 'ufo';
import type { CookieSerializeOptions } from 'cookie-es';

import type { NormalizedSocialUser, SafeUser } from '~/types/server';

export const providerPathToConfigMap = {
  '/api/oauth/github': githubConfig,
  '/api/oauth/google': googleConfig,
} as const;

const stateSerializeOptions = {
  path: '/',
  httpOnly: true,
  secure: import.meta.prod,
  sameSite: 'lax',
} satisfies CookieSerializeOptions;

export function sendOAuthRedirectIfNeeded(event: H3Event, _query?: QueryObject): boolean {
  const query = _query || getQuery(event)!;

  if (query.error || (query.state && query.code))
    return false;

  const pathWithoutQuery = event.path.split('?')[0] as keyof typeof providerPathToConfigMap;
  const providerConfig = providerPathToConfigMap[pathWithoutQuery];

  if (!providerConfig)
    throw createError({ status: 418, message: 'i a coffeepot' });

  const { site } = useRuntimeConfig().public;

  const state = createKey(KeyPrefix.OAuthState);
  const protocol = import.meta.prod ? 'https://' : 'http://';
  const redirectUrl = new URL(providerConfig.authorizeEndpoint);

  setCookie(event, 'state', state, stateSerializeOptions);

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

export async function updateOrCreateUserFromSocialAuth(socialAuth: NormalizedSocialUser): Promise<SafeUser> {
  const kysely = getKysely();

  const now = new Date();

  return await kysely.transaction().execute(async (tx) => {
    const dbUser = await tx
      .selectFrom('User')
      .where('email', '=', socialAuth.email)
      .select((eb) => [
        'User.id',
        'User.email',
        'User.username',
        jsonObjectFrom(
          eb.selectFrom('OAuth')
            .where('OAuth.id', '=', socialAuth.id)
            .where('OAuth.type', '=', socialAuth.type)
            .whereRef('OAuth.userId', '=', 'User.id')
            .select(['OAuth.id']),
        ).as('oauth'),
      ])
      .executeTakeFirst();

    if (dbUser) {
      if (!dbUser.oauth) {
        await tx
          .insertInto('OAuth')
          .values({
            id: socialAuth.id,
            type: socialAuth.type,
            userId: dbUser.id,
            updatedAt: now,
          })
          .executeTakeFirstOrThrow();
      }

      return dbUser as SafeUser;
    }
    else {
      const dbUser = await tx
        .insertInto('User')
        .values({
          username: socialAuth.username,
          email: socialAuth.email,
          updatedAt: now,
        })
        .returning(['User.id', 'User.email', 'User.username'])
        .executeTakeFirstOrThrow();

      await Promise.all([
        tx.insertInto('Folder')
          .values({
            name: `${socialAuth.username}'s workspace`,
            root: true,
            path: generateRootFolderPath(socialAuth.username),
            updatedAt: now,
            ownerId: dbUser.id,
          })
          .executeTakeFirstOrThrow(),

        tx.insertInto('OAuth')
          .values({
            id: socialAuth.id,
            type: socialAuth.type,
            updatedAt: now,
            userId: dbUser.id,
          })
          .executeTakeFirstOrThrow(),
      ]);

      return dbUser;
    }
  });
}
