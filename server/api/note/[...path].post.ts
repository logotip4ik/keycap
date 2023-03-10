import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const body = await readBody<{ parentId?: string }>(event) || {};
  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  if (!body.parentId || !path)
    return sendError(event, createError({ statusCode: 400, statusMessage: 'not enough data' }));

  const selectParams = getNoteSelectParamsFromEvent(event);

  try {
    timer.start('db');
    const note = await prisma.note.create({
      data: {
        // last route param always should be note name
        name: decodeURIComponent(notePath.split('/').at(-1)!),
        content: '',
        path: notePath,
        owner: { connect: { id: user.id } },
        parent: { connect: { id: toBigInt(body.parentId) } },
      },
      select: { ...selectParams },
    });
    timer.end();

    timer.appendHeader(event);

    return note;
  }
  catch (error) {
    return sendError(event, createError({ statusCode: 500 }));
  }
});
