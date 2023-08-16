import { destr } from 'destr';
import { eq } from 'drizzle-orm';
import { withQuery } from 'ufo';

import type { GoogleUserRes } from '~/types/server-google';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  const query = getQuery(event);

  await assertNoOAuthErrors(event);

  if (!query.code)
    return sendOAuthRedirect(event, OAuthProvider.Google);

  const googleUser = destr<GoogleUserRes>(query.socialUser) || await getGoogleUserWithEvent(event)
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'getGoogleUserWithEvent failed' });
    });

  const userValidation = useSocialUserValidator(googleUser);

  if (!userValidation.ok) {
    await event.context.logger.error({ err: userValidation.errors, msg: 'social user validation failed' });

    return sendRedirect(event, '/');
  }

  const drizzle = getDrizzle();

  if (!query.socialUser) {
    const [oauth, dbUser] = await Promise.all([
      drizzle.query.oauth
        .findFirst({
          where: eq(schema.oauth.id, googleUser.id),
          columns: {},
          with: {
            user: {
              columns: { id: true, email: true, username: true },
            },
          },
        })
        .execute(),

      drizzle.query.user
        .findFirst({
          where: eq(schema.user.email, googleUser.email),
          columns: { id: true, email: true, username: true },
        })
        .execute(),
    ])
      .catch(async (err) => {
        await event.context.logger.error({ err, msg: '(oauth|user).findFirst failed' });

        return [null, null];
      });

    user = oauth?.user || dbUser || null;
  }

  let username: string;

  if (!user) {
    username = query.username?.toString().trim() || '';
    const isUsernameValid = useUsernameValidator(username).ok
      && !(await checkIfUsernameTaken(username!));

    if (!isUsernameValid) {
      query.provider = OAuthProvider.Google;
      query.username = undefined;
      query.socialUser = googleUser;
      query.usernameTaken = await checkIfUsernameTaken(username!) ? username : '';

      return sendRedirect(event,
        withQuery('/oauth/ask-username', query),
      );
    }
  }
  else {
    username = user.username;
  }

  user = await updateOrCreateUserFromSocialAuth(
    normalizeGoogleUser(googleUser, { username }),
  )
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'updateOrCreateUserFromSocialAuth failed' });

      return null;
    });

  if (!user)
    return sendRedirect(event, '/');

  await Promise.all([
    setAuthCookies(event, user),
    removeFunctionCache(`${username}-taken`),
  ]);

  return sendRedirect(event, `/@${user.username}`);
});
