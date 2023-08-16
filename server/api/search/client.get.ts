import { like } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const query = getQuery(event) || {};

  let skip = 0;
  let select = 75;

  if (query.skip && !Number.isNaN(query.skip))
    skip = Number(query.skip);
  if (query.select && !Number.isNaN(query.select))
    select = Number(query.select);

  const drizzle = getDrizzle();
  const pathToSearch = `/${user.username}%`;

  timer.start('db');
  const [notes, folders] = await Promise.all([
    drizzle.query.note.findMany({
      offset: skip,
      limit: Math.round(select * 0.75),
      columns: { name: true, path: true },
      where: like(schema.note.path, pathToSearch),
    }),
    drizzle.query.folder.findMany({
      offset: skip,
      limit: Math.round(select * 0.25),
      columns: { name: true, path: true, root: true },
      where: like(schema.folder.path, pathToSearch),
    }),
  ]).catch(async (err) => {
    await event.context.logger.error({ err, msg: '(note|folder).findMany failed' });

    return [null, null];
  });
  timer.end();

  if (!notes || !folders)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return notes.concat(folders) as Array<FuzzyItem>;
});
