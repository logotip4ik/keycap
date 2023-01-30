import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user');
  const user = await getUserFromEvent(event);
  timer.end();

  if (!user)
    return sendError(event, createError({ statusCode: 401 }));

  const prisma = getPrisma();

  const query = getQuery(event) || {};

  let skip = 0;
  let select = 50;

  // @ts-expect-error checking if query param could be param
  if (query.skip && !isNaN(query.skip))
    skip = Number(query.skip);
  // @ts-expect-error checking if query param could be param
  if (query.select && !isNaN(query.select))
    select = Number(query.select);

  const pathToSearch = `/${user.username}`;

  timer.start('db');
  const [notes, folders] = await Promise.all([
    prisma.note.findMany({
      skip,
      where: { path: { startsWith: pathToSearch } },
      take: Math.floor(select / 2),
      select: { name: true, path: true },
    }),
    prisma.folder.findMany({
      skip,
      where: { path: { startsWith: pathToSearch } },
      take: Math.floor(select / 2),
      select: { name: true, path: true, root: true },
    }),
  ]);
  timer.end();

  timer.appendHeader(event);

  return [...notes, ...folders] as FuzzyItem[];
});
