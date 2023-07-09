import type { TypeOf } from 'suretype';

import { getPrisma } from '~/prisma';

const noteNameRE = /[\w\%]*?$/;

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const body = await readBody<{ parentId?: string }>(event) || {};
  const path = getRouterParam(event, 'path');

  if (!path)
    return createError({ statusCode: 400 });

  const notePath = generateNotePath(user.username, path);
  const noteName = decodeURIComponent((path.match(noteNameRE) || [])[0] || '').trim();

  const noteInfo: TypeOf<typeof noteCreateSchema> = {
    name: noteName,
    path: notePath,
    parentId: body.parentId!,
  };

  const validation = useNoteCreateSchema(noteInfo);

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const selectParams = getNoteSelectParamsFromEvent(event);

  timer.start('db');
  const note = await prisma.note.create({
    data: {
      // last route param always should be note name
      name: noteInfo.name,
      content: '',
      path: noteInfo.path,
      owner: { connect: { id: user.id } },
      parent: { connect: { id: toBigInt(noteInfo.parentId) } },
    },
    select: { ...selectParams },
  }).catch(() => null);
  timer.end();

  if (!note)
    return createError({ statusCode: 400 });

  timer.appendHeader(event);

  return note;
});
