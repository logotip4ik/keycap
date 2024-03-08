export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const query = getQuery(event) || {};

  let skip = 0;
  let select = 75;

  if (query.skip && !Number.isNaN(query.skip))
    skip = Number(query.skip);
  if (query.select && !Number.isNaN(query.select))
    select = Number(query.select);

  const pathToSearch = `/${user.username}`;

  timer.start('db');
  const [notes, folders] = await Promise.all([
    prisma.note.findMany({
      skip,
      where: { path: { startsWith: pathToSearch }, ownerId: user.id },
      take: Math.round(select * 0.75),
      select: { name: true, path: true },
    }),
    prisma.folder.findMany({
      skip,
      where: { path: { startsWith: pathToSearch }, ownerId: user.id },
      take: Math.round(select * 0.25),
      select: { name: true, path: true, root: true },
    }),
  ]).catch(async (err) => {
    await logger.error(event, { err, msg: '(note|folder).findMany failed' });

    throw createError({ status: 400 });
  });
  timer.end();

  timer.appendHeader(event);

  return { data: notes.concat(folders) as Array<FuzzyItem> };
});
