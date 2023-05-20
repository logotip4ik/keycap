import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  const prisma = getPrisma();

  const link = generateShareLink();

  timer.start('db');
  await prisma.share.create({
    data: {
      link,
      note: { connect: { path: notePath } },
      owner: { connect: { id: user.id } },
    },
  });
  timer.end();

  timer.appendHeader(event);

  return { link };
});
