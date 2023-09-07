import type { TypeOf } from 'suretype';

type UpdatableFields = Partial<TypeOf<typeof noteUpdateSchema> & { path: string }>;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

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
    data.path = makeNewNotePath(notePath, data.name);

  const selectParams = getNoteSelectParamsFromEvent(event);

  timer.start('db');
  const updatedNote = await prisma.note.update({
    data,
    where: { path: notePath, ownerId: user.id },
    select: { ...selectParams },
  }).catch(async (err) => {
    await event.context.logger.error({ err, msg: 'note.update failed' });
  });
  timer.end();

  if (!updatedNote)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  return { ok: true };
});

const currentNoteNameRE = /[\w%.]+$/;
function makeNewNotePath(currentPath: string, newName: string): string {
  return currentPath.replace(currentNoteNameRE, encodeURIComponent(newName));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('note.patch route', () => {
    it('correctly generated new note path', () => {
      let currentPath = '/with%20note';
      let newPath = makeNewNotePath(currentPath, 'new name');
      expect(newPath).toEqual('/new%20name');

      currentPath = '/folder/with%20note';
      newPath = makeNewNotePath(currentPath, 'new name');
      expect(newPath).toEqual('/folder/new%20name');

      currentPath = '/something%204.0';
      newPath = makeNewNotePath(currentPath, 'something 5.0');
      expect(newPath).toEqual('/something%205.0');
    });
  });
}
