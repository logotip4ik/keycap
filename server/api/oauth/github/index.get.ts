export default defineEventHandler(async (event) => {
  const code = getQuery(event).code;

  if (!code)
    return sendGitHubOAuthRedirect(event);

  const githubUser = await getGitHubUserWithEvent(event)
    .catch(() => null);

  if (!githubUser)
    return sendRedirect(event, '/');

  const prisma = getPrisma();

  const user = await prisma.$transaction(async (tx) => {
    let dbUser = await tx.user.findFirst({
      where: { email: githubUser.email },
      select: { id: true, email: true, username: true },
    });

    const socialId = githubUser.id.toString();

    if (dbUser) {
      await tx.user.update({
        where: { id: dbUser.id },
        data: {
          socials: {
            connectOrCreate: {
              where: { id: socialId },
              create: { id: socialId, type: 'GitHub' },
            },
          },
        },
      });
    }
    else {
      dbUser = await prisma.user.create({
        select: { id: true, email: true, username: true },
        data: {
          email: githubUser.email,
          username: githubUser.login,

          folders: {
            create: {
              name: `${githubUser.login}'s workspace`,
              root: true,
              path: generateRootFolderPath(githubUser.login),
            },
          },

          socials: {
            create: { id: socialId, type: 'GitHub' },
          },
        },
      });
    }

    return dbUser;
  }).catch(() => null);

  // TODO: add better error handling
  if (!user)
    return sendRedirect(event, '/');

  await setAuthCookies(event, user);

  return sendRedirect(event, `/@${user.username}`);
});
