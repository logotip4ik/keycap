import type { TypeOf } from 'suretype';

type UpdatableFields = Partial<TypeOf<typeof noteUpdateSchema> & { path: string }>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  const notePath = generateNotePath(user.username, path);

  const data = await readBody<UpdatableFields>(event) || {};

  if (data.name)
    data.name = data.name.trim();
  if (data.content)
    data.content = data.content.trim();

  const validation = useNoteUpdateValidation(data);

  if (!validation.ok) {
    throw createError({
      status: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  // if user updates note name we also need to update its path
  if (data.name)
    data.path = makeNewItemPath(notePath, data.name);

  timer.start('db');
  await prisma.note.update({
    data,
    where: { path: notePath, ownerId: user.id },
    select: { id: true },
  }).catch(async (err) => {
    if (err.code === PrismaError.UniqueConstraintViolation) {
      throw createError({
        status: 400,
        message: 'Note with such name already exists',
      });
    }

    await logger.error(event, { err, msg: 'note.update failed' });

    throw createError({ status: 400 });
  });
  timer.end();

  timer.appendHeader(event);

  return sendNoContent(event);
});
