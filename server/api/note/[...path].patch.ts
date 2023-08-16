import { and, eq } from 'drizzle-orm';
import type { TypeOf } from 'suretype';

type UpdatableFields = Partial<TypeOf<typeof noteUpdateSchema> & { path: string }>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);

  const data = await readBody<UpdatableFields>(event) || {};

  if (data.name) data.name = data.name.trim();
  if (data.content) data.content = data.content.trim();

  const validation = useNoteUpdateValidation(data);

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  // if user updates note name we also need to update its path
  if (data.name)
    data.path = makeNewNotePath(path, data.name);

  const drizzle = getDrizzle();

  timer.start('db');
  const updatedNote = await drizzle
    .update(schema.note)
    .set({
      name: data.name,
      content: data.content,
      path: data.path,
      updatedAt: new Date(),
    })
    .where(and(
      eq(schema.note.path, notePath),
      eq(schema.note.ownerId, user.id),
    ))
    .execute();
  // }).catch(async (err) => {
  //   await event.context.logger.error({ err, msg: 'note.update failed' });
  // });
  timer.end();

  if (!updatedNote)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return { ok: true };
});

const currentNoteNameRE = /[\w%]+$/;
function makeNewNotePath(currentPath: string, newName: string): string {
  return currentPath.replace(currentNoteNameRE, encodeURIComponent(newName));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('note.patch route', () => {
    it('correctly generated new note path', () => {
      const currentPath = '/with%20note';
      const newPath = makeNewNotePath(currentPath, 'new name');
      expect(newPath).toEqual('/new%20name');

      const currentInFolderPath = '/folder/with%20note';
      const newInFolderPath = makeNewNotePath(currentInFolderPath, 'new name');
      expect(newInFolderPath).toEqual('/folder/new%20name');
    });
  });
}
