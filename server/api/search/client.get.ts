export default defineEventHandler(async (event) => {
  const user = requireUserFromEvent(event);
  const timer = requireTimerFromEvent(event);

  const skip = 0;
  const select = 75;

  // TODO ?
  // if (query.skip && !Number.isNaN(query.skip))
  //   skip = Number(query.skip);
  // if (query.select && !Number.isNaN(query.select))
  //   select = Number(query.select);

  const kysely = getKysely();

  timer.start('db');
  const [notes, folders] = await kysely
    .transaction()
    .execute(async (tx) => await Promise.all([
      tx.selectFrom('Note')
        .where('ownerId', '=', user.id)
        .select(['name', 'path'])
        .offset(skip)
        .limit(Math.round(select * 0.75))
        .execute(),

      tx.selectFrom('Folder')
        .where('ownerId', '=', user.id)
        .select(['name', 'path', 'root'])
        .offset(skip)
        .limit(Math.round(select * 0.25))
        .execute(),
    ]))
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'search.client failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  timer.appendHeader(event);

  return { data: notes.concat(folders) as Array<FuzzyItem> };
});
