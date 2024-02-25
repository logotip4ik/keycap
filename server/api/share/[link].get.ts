export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link || !isShareLinkValid(link))
    throw createError({ status: 400 });

  const prisma = getPrisma();

  const note = await prisma.note.findFirst({
    select: { name: true, content: true, updatedAt: true, createdAt: true },
    where: { shares: { some: { link } } },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'note.findFirst failed' });

    throw createError({ status: 400 });
  });

  if (!note)
    throw createError({ status: 404 });

  return { data: note };
});
