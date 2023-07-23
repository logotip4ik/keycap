export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const kysely = getKysely();

  const link = generateShareLink();

  timer.start('db');

  const share = await kysely
    .transaction()
    .execute(async (tx) => {
      const note = await tx
        .selectFrom('Note')
        .where(({ and, eb }) => and([
          eb('Note.path', '=', notePath),
          eb('Note.ownerId', '=', user.id),
        ]))
        .leftJoin('Share', 'Share.noteId', 'Note.id')
        .select(['Note.id', 'Share.id as shareId'])
        .executeTakeFirst();

      if (!note)
        throw new Error('no note was found');

      if (note && note.shareId)
        return note.shareId;

      await tx
        .insertInto('Share')
        .values({
          link,
          noteId: note.id,
          ownerId: user.id,
          updatedAt: new Date(),
        })
        .execute();

      return true;
    })
    .catch(() => null);

  timer.end();

  if (!share)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return { link };
});
