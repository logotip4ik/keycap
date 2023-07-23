export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const kysely = getKysely();

  const query = getQuery(event);
  const isDetailsRequest = typeof query.details !== 'undefined';

  timer.start('db');
  const _note = await kysely
    .selectFrom('Note')
    .where(({ and, eb }) => and([
      eb('Note.path', '=', notePath),
      eb('Note.ownerId', '=', user.id),
    ]))
    .$if(!isDetailsRequest, (eb) =>
      eb.select(['Note.id', 'Note.name', 'Note.content', 'Note.path']),
    )
    .$if(isDetailsRequest, (eb) =>
      eb
        .leftJoin('Share', 'Share.noteId', 'Note.id')
        .select([
          'Note.updatedAt', 'Note.createdAt',
          'Share.link as share_link', 'Share.updatedAt as share_updatedAt', 'Share.createdAt as share_createdAt',
        ]),
    )
    .executeTakeFirst()
    .catch(() => null);
  timer.end();

  if (!_note)
    throw createError({ statusCode: 404 });

  const note = isDetailsRequest
    ? makeDetailsNote(_note)
    : makeNormalNote(_note);

  timer.appendHeader(event);

  return note;
});

export interface NoteDetails {
  updatedAt: Date
  createdAt: Date
  share?: { link: string; updatedAt: Date; createdAt: Date }
}
function makeDetailsNote(note: any): NoteDetails {
  const transformedNote: NoteDetails = {
    updatedAt: note.updatedAt,
    createdAt: note.createdAt,
  };

  if (note.share_link) {
    transformedNote.share = {
      link: note.share_link,
      updatedAt: note.share_updatedAt,
      createdAt: note.share_createdAt,
    };
  }

  return transformedNote;
}

function makeNormalNote(note: any): { id: string; name: string; content?: string; path: string } {
  return note;
}
