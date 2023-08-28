import parseDuration from 'parse-duration';

export default defineCachedEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;
  const logger = event.context.logger;

  const prisma = getPrisma();

  timer.start('db');
  // TODO: more advanced recent algorithm :P
  const recent = await prisma.note.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, path: true },
    take: 4,
    orderBy: { updatedAt: 'desc' },
  }).catch(async (err) => {
    await logger.error({ err }, 'note.findMany failed');
  });
  timer.end();

  timer.appendHeader(event);

  return recent;
}, {
  swr: true,
  maxAge: parseDuration('5 minutes', 's'),
  staleMaxAge: parseDuration('30 minutes', 's'),
  getKey: (event) => `${event.context.user!.username}-recent`,
});
