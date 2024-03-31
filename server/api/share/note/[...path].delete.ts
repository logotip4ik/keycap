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
  await kysely.transaction().execute(async (tx) => {
    const shareToDelete = await tx
      .selectFrom('Note')
      .rightJoin('Share', 'Share.noteId', 'Note.id')
      .select('Share.id')
      .where('Note.path', '=', notePath)
      .where('Note.ownerId', '=', user.id)
      .where('Share.ownerId', '=', user.id)
      .executeTakeFirst();

    if (!shareToDelete) {
      throw createError({ status: 404 });
    }

    await tx
      .deleteFrom('Share')
      .where('id', '=', shareToDelete.id)
      .execute()
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'share.note.delete failed (can\'t delete share)' });

        throw createError({ status: 400 });
      });
  });
  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return sendNoContent(event);
});
