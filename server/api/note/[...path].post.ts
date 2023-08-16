import type { TypeOf } from 'suretype';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const body = await readBody<TypeOf<typeof noteCreateSchema>>(event) || {};

  if (body.name) body.name = body.name.trim();

  body.path = generateNotePath(user.username, path);

  const validation = useNoteCreateValidation(body);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const drizzle = getDrizzle();

  timer.start('db');
  const note = await drizzle
    .insert(schema.note)
    .values({
      name: body.name,
      content: '',
      path: body.path,
      ownerId: user.id,
      parentId: toBigInt(body.parentId),
      updatedAt: new Date(),
    })
    .returning({ id: schema.note.id })
    .execute()
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'note.create failed' });
    });
  timer.end();

  if (!note)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return {
    id: note[0].id,
    name: body.name,
    content: '',
    path: body.path,
  };
});
