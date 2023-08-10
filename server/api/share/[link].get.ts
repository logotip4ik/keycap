export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link)
    throw createError({ statusCode: 400 });

  if (!isShareLinkValid(link))
    throw createError({ statusCode: 404 }); // TODO: use 400 code

  const prisma = getPrisma();

  const note = await prisma.note.findFirst({
    select: { name: true, content: true, updatedAt: true, createdAt: true },
    where: { shares: { some: { link } } },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'note.findFirst failed' });
  });

  if (!note)
    throw createError({ statusCode: 404 });

  return note;
});
