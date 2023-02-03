import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const timer = createTimer();

  const { user } = event.context;

  if (!user)
    return createError({ statusCode: 401 });

  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  try {
    timer.start('db');
    await prisma.note.delete({ where: { path: notePath } });
    timer.end();

    timer.appendHeader(event);

    return { ok: true };
  }
  catch (error) {
    return createError({ statusCode: 500 });
  }
});
