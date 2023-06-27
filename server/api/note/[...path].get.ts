import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    return createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();
  const selectParams = getNoteSelectParamsFromEvent(event);

  timer.start('db');
  const note = await prisma.note.findFirst({
    where: { path: notePath, ownerId: user.id },
    select: { ...selectParams },
  }).catch((err) => {
    event.context.logger.log('error', 'note.get failed', err, { path: event.path });
  });
  timer.end();

  if (!note)
    return createError({ statusCode: 404 });

  timer.appendHeader(event);

  return note;
});
