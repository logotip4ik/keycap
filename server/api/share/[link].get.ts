import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!isShareLinkValid(link || ''))
    return createError({ statusCode: 404 });

  const prisma = getPrisma();

  const note = await prisma.note.findFirst({
    select: { name: true, content: true, updatedAt: true, createdAt: true },
    where: { shares: { some: { link } } },
  }).catch((err) => {
    event.context.logger.error(err, 'note.findFirst failed');
  });

  if (!note)
    return createError({ statusCode: 404 });

  return note;
});
