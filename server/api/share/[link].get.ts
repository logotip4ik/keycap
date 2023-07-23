export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link)
    throw createError({ statusCode: 400 });

  if (!isShareLinkValid(link))
    throw createError({ statusCode: 404 });

  const kysely = getKysely();

  const note = await kysely
    .selectFrom('Note')
    .leftJoin('Share', 'Share.noteId', 'Note.id')
    .select(['Note.name', 'Note.content', 'Note.updatedAt', 'Note.createdAt'])
    .where('Share.link', '=', link)
    .executeTakeFirst();

  if (!note)
    throw createError({ statusCode: 404 });

  return note;
});
