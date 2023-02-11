import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  timer.start('db');
  const note = await prisma.note.findFirst({
    where: { path: notePath, ownerId: user.id },
    select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
  });
  timer.end();

  timer.appendHeader(event);

  if (!note)
    return createError({ statusCode: 404 });

  return note;
});
