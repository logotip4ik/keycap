import postgres from 'postgres';

export default defineEventHandler(async (event) => {
  const user = requireUserFromEvent(event);
  const timer = requireTimerFromEvent(event);

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const data = await readSecureBody(event, noteCreateValidator, {
    path: generateNotePath(user.username, path),
  });

  const kysely = getKysely();

  timer.start('db');
  const note = await kysely
    .insertInto('Note')
    .values({
      name: data.name,
      content: '',
      path: data.path,
      ownerId: user.id,
      parentId: data.parentId,
      updatedAt: new Date(),
    })
    .returning(['id', 'name', 'content', 'path'])
    .executeTakeFirst()
    .catch(async (err) => {
      if (
        err instanceof postgres.PostgresError
        && err.code === PG_UNIQUE_VIOLATION
      ) {
        throw createError({
          status: 400,
          message: 'Note with such name already exists',
        });
      }

      await logger.error(event, { err, msg: 'note.create failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  timer.appendHeader(event);

  return { data: note };
});
