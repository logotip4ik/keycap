import getPrisma from '~/prisma';
import { getUserFromEvent } from '~/server/utils/auth';

import type { FuzzyItem } from '~/types/store';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

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

  return [...notes, ...folders] as FuzzyItem[];
});
