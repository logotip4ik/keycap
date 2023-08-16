import { destr } from 'destr';
import { eq } from 'drizzle-orm';
import { withQuery } from 'ufo';

import type { GitHubUserRes } from '~/types/server-github';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  const query = getQuery(event);

  await assertNoOAuthErrors(event);

  // This means that user was redirected here to actually sign in
  // with social accout, so this technically is not an error
  if (!query.code)
    return sendOAuthRedirect(event, OAuthProvider.GitHub);

  const githubUser = destr<GitHubUserRes>(query.socialUser) || await getGitHubUserWithEvent(event)
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'getGitHubUserWithEvent failed' });
    });

  const userValidation = useSocialUserValidator(githubUser);

  if (!userValidation.ok) {
    await event.context.logger.error({ err: userValidation.errors, msg: 'social user validation failed' });

    return sendRedirect(event, '/');
  }

  const drizzle = getDrizzle();

  if (!query.socialUser) {
    const [oauth, dbUser] = await Promise.all([
      drizzle.query.oauth
        .findFirst({
          where: eq(schema.oauth.id, githubUser.id.toString()),
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
          where: eq(schema.user.email, githubUser.email),
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
      query.provider = OAuthProvider.GitHub;
      query.username = undefined;
      query.socialUser = githubUser;
      query.usernameTaken = await checkIfUsernameTaken(username!) ? username : '';

      // NOTE: this basically makes infinate loop
      // to force user to input correct username
      return sendRedirect(event,
        withQuery('/oauth/ask-username', query),
      );
    }
  }
  else {
    username = user.username;
  }

  user = await updateOrCreateUserFromSocialAuth(
    normalizeGitHubUser(githubUser, { username }),
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
