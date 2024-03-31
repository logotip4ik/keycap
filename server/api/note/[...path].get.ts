import { jsonArrayFrom } from 'kysely/helpers/postgres';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path) {
    throw createError({ status: 400 });
  }

  const notePath = generateNotePath(user.username, path);

  const selectFunction = getQuery(event).details === undefined
    ? selectNote
    : selectNoteDetails;

  timer.start('db');
  const note = await selectFunction(notePath, user.id)
    .catch(async (err) => {
      await logger.error(event, { err, msg: 'note.get failed' });

      throw createError({ status: 400 });
    });
  timer.end();

  if (!note) {
    throw createError({ status: 404 });
  }

  timer.appendHeader(event);

  return { data: note };
});

function selectNote(path: string, ownerId: string) {
  const kysely = getKysely();

  return kysely
    .selectFrom('Note')
    .where('path', '=', path)
    .where('ownerId', '=', ownerId)
    .select(['id', 'name', 'path', 'content'])
    .executeTakeFirst();
}

function selectNoteDetails(path: string, ownerId: string) {
  const kysely = getKysely();

  return kysely
    .selectFrom('Note')
    .where('path', '=', path)
    .where('ownerId', '=', ownerId)
    .select((eb) => [
      'updatedAt',
      'createdAt',
      jsonArrayFrom(
        eb.selectFrom('Share')
          .where('ownerId', '=', ownerId)
          .whereRef('noteId', '=', 'Note.id')
          .select('Share.link')
          .limit(1),
      ).as('shares'),
    ])
    .executeTakeFirst();
}
