import { destr } from 'destr';
import { withQuery } from 'ufo';

import type { GitHubUserRes } from '~/types/server-github';

export default defineEventHandler(async (event) => {
  let user = event.context.user;

  if (user)
    return sendRedirect(event, `/@${user.username}`);

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

  const prisma = getPrisma();

  if (!query.socialUser) {
    const oauth = await prisma.oAuth.findFirst({
      where: { id: githubUser.id.toString() },
      select: {
        user: { select: { id: true, email: true, username: true } },
      },
    });

    user = oauth?.user || null;
  }

  let username: string;

  if (!user) {
    username = query.username?.toString().trim() || '';
    const isUsernameValid = useUsernameValidator(username).ok
      && !(await checkIfUsernameTaken(username!));

    if (!isUsernameValid) {
      query.provider = OAuthProvider.GitHub.toLowerCase();
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
