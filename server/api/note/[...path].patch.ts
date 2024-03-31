import postgres from 'postgres';

import type { Static } from '@sinclair/typebox';

interface NoteUpdateFields extends Static<typeof noteUpdateSchema> {
  path?: string
  updatedAt?: Date
}

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ status: 400 });

  const notePath = generateNotePath(user.username, path);

  const data = await readBody<NoteUpdateFields>(event) || {};

  if (typeof data.name === 'string')
    data.name = data.name.trim();
  if (typeof data.content === 'string')
    data.content = data.content.trim();

  const error = noteUpdateValidator.Errors(data).First();

  if (error) {
    throw createError({
      status: 400,
      message: formatTypboxError(error),
    });
  }

  data.updatedAt = new Date();

  // if user updates note name we also need to update its path
  if (data.name)
    data.path = makeNewItemPath(notePath, data.name);

  const kysely = getKysely();

  timer.start('db');
  await kysely
    .updateTable('Note')
    .where('path', '=', notePath)
    .where('ownerId', '=', user.id)
    .set(data)
    .execute()
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

      await logger.error(event, { err, msg: 'note.update failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  timer.appendHeader(event);

  return sendNoContent(event);
});
