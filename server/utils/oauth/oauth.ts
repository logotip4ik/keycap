import type { NormalizedSocialUser } from '#server/types/server';

import type { CookieSerializeOptions } from 'cookie-es';
import type { H3Event } from 'h3';
import type { QueryObject } from 'ufo';

const stateSerializeOptions = {
  path: '/',
  httpOnly: true,
  secure: import.meta.prod,
  sameSite: 'lax',
} satisfies CookieSerializeOptions;

export function deleteOAuthStateCookie(event: H3Event) {
  deleteCookie(event, 'state', stateSerializeOptions);
}

export function sendOAuthRedirectIfNeeded({ event, query, config }: { event: H3Event, query?: QueryObject, config: OAuthProviderConfig }): boolean {
  if (!query) {
    query = getQuery(event)!;
  }

  if (query.error || (query.state && query.code)) {
    return false;
  }

  const { site } = useRuntimeConfig().public;

  const state = createKey(KeyPrefix.OAuthState);
  const redirectUrl = new URL(config.authorizeEndpoint);

  setCookie(event, 'state', state, stateSerializeOptions);

  redirectUrl.searchParams.set('state', state);
  redirectUrl.searchParams.set('client_id', config.oauth.clientId);
  redirectUrl.searchParams.set('response_type', 'code');
  redirectUrl.searchParams.set('response_mode', 'query');
  redirectUrl.searchParams.set('scope', config.scope);
  redirectUrl.searchParams.set('redirect_uri', `${defaultProtocol}${site}/api/oauth/${config.name}`);

  if (config.options) {
    for (const key in config.options) {
      redirectUrl.searchParams.set(key, config.options[key]);
    }
  }

  sendRedirect(event, redirectUrl.toString());

  return true;
}

export async function assertNoOAuthErrors(event: H3Event, query: QueryObject) {
  // Can't delete the cookie here, because user might need to enter a username
  // which is done later, with separate check
  // deleteCookie(event, 'state');

  if (query.error) {
    deleteOAuthStateCookie(event);

    await logger.error(event, { err: new Error(query.error.toString()), msg: 'oauth failed' });

    throw createError({ status: 418, message: decodeURIComponent(query.error.toString()) });
  }

  const stateCookie = getCookie(event, 'state');
  if (typeof query.state !== 'string' || query.state !== stateCookie) {
    deleteOAuthStateCookie(event);

    const identifier = getRequestIP(event, { xForwardedFor: true });

    await logger.error(event, {
      msg: 'someone is messing with authentication',
      identifier,
      stateCookie,
    });

    throw createError({ status: 422 });
  }
}

export async function createUserWithSocialAuth(socialAuth: NormalizedSocialUser) {
  const kysely = getKysely();
  const now = new Date();

  const { public: { site } } = useRuntimeConfig();
  const firstNoteTemplate = await getHtmlTemplate('FirstNote');
  const firstNote = processTemplate(firstNoteTemplate, {
    siteUrl: `https://${site}`,
  });

  return await kysely.transaction().execute(async (tx) => {
    const dbUser = await tx
      .insertInto('User')
      .values({
        username: socialAuth.username,
        email: socialAuth.email,
        updatedAt: now,
      })
      .returning(['id', 'email', 'username'])
      .executeTakeFirstOrThrow();

    const [rootFolder] = await Promise.all([
      tx.insertInto('Folder')
        .values({
          name: `${socialAuth.username}'s workspace`,
          root: true,
          path: generateRootFolderPath(socialAuth.username),
          ownerId: dbUser.id,
          updatedAt: now,
        })
        .returning('id')
        .executeTakeFirstOrThrow(),

      tx.insertInto('OAuth')
        .values({
          id: socialAuth.id,
          type: socialAuth.type,
          userId: dbUser.id,
          updatedAt: now,
        })
        .executeTakeFirstOrThrow(),
    ]);

    await tx
      .insertInto('Note')
      .values({
        name: 'My first note',
        ownerId: dbUser.id,
        parentId: rootFolder.id,
        path: generateFolderPath(dbUser.username, encodeURI('My first note')),
        updatedAt: new Date(),
        content: firstNote,
      })
      .executeTakeFirstOrThrow();

    return dbUser;
  });
}

export function updateUserWithSocialAuth(userId: string, socialAuth: NormalizedSocialUser) {
  const kysely = getKysely();

  return kysely.transaction().execute(async (tx) => {
    const oauth = await tx
      .selectFrom('OAuth')
      .where('id', '=', socialAuth.id)
      .where('type', '=', socialAuth.type)
      .where('userId', '=', userId)
      .select((eb) => eb.lit(true).as('exists'))
      .executeTakeFirst();

    if (oauth?.exists) {
      return;
    }

    await tx
      .insertInto('OAuth')
      .values({
        id: socialAuth.id,
        type: socialAuth.type,
        userId,
        updatedAt: new Date(),
      })
      .executeTakeFirstOrThrow();
  });
}
