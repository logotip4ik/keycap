import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  const link = generateShareLink();

  timer.start('db');
  const share = await prisma.share.create({
    select: { id: true },
    data: {
      link,
      note: { connect: { path: notePath } },
      owner: { connect: { id: user.id } },
    },
  }).catch(() => null);
  timer.end();

  if (!share)
    return createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return { link };
});
