import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const query = getQuery(event);
  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  const whitelistedFieldUpdates: Array<'name' | 'content'> = ['name', 'content'];

  interface UpdatableFields { name?: string; content?: string }
  const fieldsToUpdate = await readBody<UpdatableFields>(event);

  const data: UpdatableFields & { path?: string } = {};

  for (const field of whitelistedFieldUpdates)
    if (fieldsToUpdate[field]) data[field] = fieldsToUpdate[field];

  // if user updates note name we also need to update its path
  if (data.name) {
    // replacing last string after `/` with new note name
    const newNotePath = path.split('/').slice(0, -1).concat(encodeURIComponent(data.name)).join('/');

    data.path = generateNotePath(user.username, newNotePath);
  }

  const selectParams = getNoteSelectParamsFromEvent(event);

  try {
    timer.start('db');
    const updatedNote = await prisma.note.update({
      data,
      where: { path: notePath },
      select: { ...selectParams },
    });
    timer.end();

    timer.appendHeader(event);

    if (query.getNote === 'true')
      return updatedNote;

    return { ok: true };
  }
  catch {
    return createError({ statusCode: 400 });
  }
});
