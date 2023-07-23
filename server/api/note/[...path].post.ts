import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const body = await readBody<TypeOf<typeof noteCreateSchema>>(event) || {};

  body.path = generateNotePath(user.username, path);

  const validation = useNoteCreateValidation(body);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const kysely = getKysely();

  timer.start('db');
  const note = await kysely
    .insertInto('Note')
    .values({
      name: body.name,
      path: body.path,
      content: '',
      ownerId: user.id,
      parentId: body.parentId,
      updatedAt: new Date(),
    })
    .returning(['id', 'name', 'content', 'path'])
    .executeTakeFirst();
  timer.end();

  if (!note)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return note;
});
