export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link))
    throw createError({ status: 400 });

  const kysely = getKysely();

  const note = await kysely
    .selectFrom('Share')
    .where('link', '=', link)
    .rightJoin('Note', 'Note.id', 'Share.noteId')
    .select(['Note.name', 'Note.content', 'Note.updatedAt', 'Note.createdAt'])
    .executeTakeFirst()
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'sharedNote.get failed' });

      throw createError({ status: 400 });
    });

  if (!note)
    throw createError({ status: 404 });

  return { data: note };
});
