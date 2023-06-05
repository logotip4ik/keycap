import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  if (event.context.user) return null;

  const reqUrl = getRequestURL(event);
  const origin = getHeader(event, 'origin');

  // https://github.com/sveltejs/kit/blob/21272ee81d915b1049c4ba1ab981427fac232e80/packages/kit/src/runtime/server/respond.js#L56
  if (reqUrl.origin !== origin)
    return createError({ statusCode: 403 });

  const body = await readBody(event) || {};

  if (body.email) body.email = body.email.trim();
  if (body.username) body.username = body.username.trim().replace(/\s/g, '_');
  if (body.password) body.password = body.password.trim();

  const validation = useRegistrationValidator(body);

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const prisma = getPrisma();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      username: body.username,
      password: await hashPassword(body.password),
      folders: {
        create: {
          name: `${body.username}'s workspace`,
          root: true,
          path: generateRootFolderPath(body.username),
        },
      },
    },

    select: { id: true, email: true, username: true },
  }).catch(() => null);

  if (!user)
    return createError({ statusCode: 400, statusMessage: 'user with this email or username might already exist' });

  await setAuthCookies(event, user);

  if (typeof body.browserAction !== 'undefined')
    return sendRedirect(event, `/@${user.username}`);

  setResponseStatus(event, 201);

  return user;
});
