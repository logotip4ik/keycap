import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  const body = await readBody<TypeOf<typeof noteCreateSchema>>(event) || {};

  body.name = body.name?.trim();
  body.path = generateNotePath(user.username, path);

  const validation = useNoteCreateValidation(body);

  if (!validation.ok) {
    throw createError({
      status: 400,
      message: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const kysely = getKysely();

  timer.start('db');
  const note = await kysely
    .insertInto('Note')
    .values({
      name: body.name,
      content: '',
      path: body.path,
      ownerId: user.id,
      parentId: body.parentId,
      updatedAt: new Date(),
    })
    .returning(['id', 'name', 'content', 'path'])
    .executeTakeFirst()
    .catch(async (err) => {
      if (err.code === PrismaError.UniqueConstraintViolation) {
        throw createError({
          status: 400,
          message: 'Note with such name already exists',
        });
      }

      await logger.error(event, { err, msg: 'note.create failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  timer.appendHeader(event);

  return { data: note };
});
