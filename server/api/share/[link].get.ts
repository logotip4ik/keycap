import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const link = getRouterParam(event, 'link');

  if (!link)
    throw createError({ statusCode: 400 });

  if (!isShareLinkValid(link))
    throw createError({ statusCode: 400 });

  const drizzle = getDrizzle();

  const note = await drizzle.query.note
    .findFirst({
      columns: {
        name: true,
        content: true,
        updatedAt: true,
        createdAt: true,
      },
      with: {
        shares: {
          columns: { link: true },
          where: eq(schema.share.link, link),
        },
      },
    });

  if (!note)
    throw createError({ statusCode: 404 });

  return note;
});
