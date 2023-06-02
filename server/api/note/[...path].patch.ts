import { compile, v } from 'suretype';

import { getPrisma } from '~/prisma';

const noteUpdateSchema = v.object({
  name: v.string().minLength(2),
  content: v.string(),
});

const useNoteUpdateValidator = compile(noteUpdateSchema, { colors: false });

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const query = getQuery(event);
  const path = getRouterParam(event, 'path') as string;
  const notePath = generateNotePath(user.username, path);

  interface UpdatableFields { name?: string; content?: string; path?: string }
  const data = await readBody<UpdatableFields>(event) || {};

  if (data.name) data.name = data.name.trim();
  if (data.content) data.content = data.content.trim();

  const validation = useNoteUpdateValidator(data);

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  // if user updates note name we also need to update its path
  if (data.name) {
    // replacing last string after `/` with new note name
    const newNotePath = path.split('/').slice(0, -1).concat(encodeURIComponent(data.name)).join('/');

    data.path = generateNotePath(user.username, newNotePath);
  }

  const selectParams = getNoteSelectParamsFromEvent(event);

  timer.start('db');
  const updatedNote = await prisma.note.update({
    data,
    where: { path: notePath },
    select: { ...selectParams },
  }).catch(() => null);
  timer.end();

  if (!updatedNote)
    return createError({ statusCode: 400 });

  timer.appendHeader(event);

  if (query.getNote === 'true')
    return updatedNote;

  return { ok: true };
});
