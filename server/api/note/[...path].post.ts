import postgres from 'postgres';

import type { Static } from '@sinclair/typebox';

type NoteCreateFields = Static<typeof noteCreateSchema>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const body = await readBody<NoteCreateFields>(event) || {};

  body.name = body.name?.trim();
  body.path = generateNotePath(user.username, path);

  const error = noteCreateValidator.Errors(body).First();

  if (error) {
    throw createError({
      status: 400,
      message: formatTypboxError(error),
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
      if (
        err instanceof postgres.PostgresError
        && err.code === PostgresErrorCode.PG_UNIQUE_VIOLATION
      ) {
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
