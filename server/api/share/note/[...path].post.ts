export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const notePath = generateNotePath(user.username, path);

  const kysely = getKysely();

  timer.start('db');
  const share = await kysely.transaction().execute(async (tx) => {
    const note = await tx
      .selectFrom('Note')
      .leftJoin('Share', 'Share.noteId', 'Note.id')
      .where('Note.path', '=', notePath)
      .where('Note.ownerId', '=', user.id)
      .select(['Note.id', 'Share.link'])
      .executeTakeFirst();

    if (!note) {
      throw createError({ status: 404 });
    }

    if (note.link) {
      return note as { link: string };
    }

    const link = generateShareLink();

    await tx
      .insertInto('Share')
      .values({
        link,
        noteId: note.id,
        ownerId: user.id,
        updatedAt: new Date(),
      })
      .executeTakeFirst()
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'share.note.post failed (can\'t create share)' });

        throw createError({ status: 400 });
      });

    return { link };
  });
  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return {
    data: {
      link: share.link,
    },
  };
});
