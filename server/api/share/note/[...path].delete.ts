export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  // const prisma = getPrisma();
  const kysely = getKysely();

  // NOTE: there is no point from removing cached page because website is hosted on vercel

  timer.start('db');

  await kysely
    .transaction()
    .execute(async (tx) => {
      const shareToDelete = await tx
        .selectFrom('Share')
        .leftJoin('Note', 'Note.id', 'Share.noteId')
        .where(({ and, eb }) => and([
          eb('Share.ownerId', '=', user.id),
          eb('Note.path', '=', notePath),
        ]))
        .select('Share.id')
        .executeTakeFirst();

      if (!shareToDelete || !shareToDelete.id)
        throw createError({ statusCode: 400 });

      await tx
        .deleteFrom('Share')
        .where('Share.id', '=', shareToDelete.id)
        .execute();
    });

  timer.end();

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
