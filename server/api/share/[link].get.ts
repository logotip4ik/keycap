export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link)
    return createError({ statusCode: 400 });

  if (!isShareLinkValid(link))
    return createError({ statusCode: 404 });

  const prisma = getPrisma();

  const note = await prisma.note.findFirst({
    select: { name: true, content: true, updatedAt: true, createdAt: true },
    where: { shares: { some: { link } } },
  }).catch(() => null);

  if (!note)
    return createError({ statusCode: 404 });

  return note;
});
