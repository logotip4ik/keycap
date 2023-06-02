import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const query = getQuery(event) || {};

  let skip = 0;
  let select = 50;

  if (query.skip && !Number.isNaN(query.skip))
    skip = Number(query.skip);
  if (query.select && !Number.isNaN(query.select))
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
  ]).catch(() => [null, null]);
  timer.end();

  if (!notes || !folders)
    return createError({ statusCode: 500 });

  timer.appendHeader(event);

  return [...notes, ...folders] as FuzzyItem[];
});
