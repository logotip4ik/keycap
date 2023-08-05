export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link)
    throw createError({ statusCode: 400 });

  if (!isShareLinkValid(link))
    throw createError({ statusCode: 404 });

  const prisma = getPrisma();

  const note = await prisma.note.findFirst({
    select: { name: true, content: true, updatedAt: true, createdAt: true },
    where: { shares: { some: { link } } },
  }).catch((err) => {
    event.context.logger.error({ err }, 'note.findFirst failed');
  });

  if (!note)
    throw createError({ statusCode: 404 });

  return note;
});
