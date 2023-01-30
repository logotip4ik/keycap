import type { Note } from '@prisma/client';

import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const timer = createTimer();

  timer.start('user');
  const user = await getUserFromEvent(event);
  timer.end();

  if (!user) return sendError(event, createError({ statusCode: 401 }));

  const notePath = getRouterParam(event, 'path') as string;

  const prisma = getPrisma();

  if (isMethod(event, 'POST')) {
    interface BodyNote { content?: string; parentId: string }
    const body = await readBody<BodyNote>(event) || {};

    const path = getRouterParam(event, 'path');

    if (!body.parentId || !path)
      return sendError(event, createError({ statusCode: 400, statusMessage: 'not enough data' }));

    try {
      timer.start('db');
      const note = await prisma.note.create({
        data: {
          name: decodeURIComponent(path.split('/').at(-1)), // last route param always should be note name
          content: body.content ?? '',
          path: generateNotePath(user.username, path),
          owner: { connect: { id: user.id } },
          parent: { connect: { id: toBigInt(body.parentId) } },
        },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });

      timer.end();
      timer.appendHeader(event);

      return note;
    }
    catch (error) {
      return sendError(event, createError({ statusCode: 500 }));
    }
  }

  if (isMethod(event, 'GET')) {
    try {
      timer.start('db');

      const note = await prisma.note.findFirst({
        where: { path: generateNotePath(user.username, notePath), ownerId: user.id },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });

      timer.end();
      timer.appendHeader(event);

      if (!note)
        return sendError(event, createError({ statusCode: 404 }));

      return note;
    }
    catch (error) {
      return sendError(event, createError({ statusCode: 500 }));
    }
  }

  if (isMethod(event, 'PATCH')) {
    interface UpdatableFields { name?: string; content?: string }

    const whitelistedFieldUpdates: Array<'name' | 'content'> = ['name', 'content'];
    const fieldsToUpdate = await readBody<UpdatableFields>(event);
    const query = getQuery(event);

    const data: UpdatableFields & { path?: string } = {};

    for (const field of whitelistedFieldUpdates)
      if (fieldsToUpdate[field]) data[field] = fieldsToUpdate[field];

    // if user updates note name we also need to update its path
    if (data.name) {
      // replacing last string after `/` with new note name
      const newNotePath = notePath.split('/').slice(1, -1).concat([encodeURIComponent(data.name)]).join('/');

      data.path = generateNotePath(user.username, newNotePath);
    }

    let updatedNote: Omit<Note, 'ownerId' | 'parentId'>;

    try {
      timer.start('db');

      updatedNote = await prisma.note.update({
        data,
        where: { path: generateNotePath(user.username, notePath) },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });

      timer.end();
      timer.appendHeader(event);
    }
    catch {
      return sendError(event, createError({ statusCode: 400 }));
    }

    if (query.getNote === 'true')
      return updatedNote;

    return { ok: true };
  }

  if (isMethod(event, 'DELETE')) {
    const path = getRouterParam(event, 'path');

    if (!path) return sendError(event, createError({ statusCode: 400 }));

    if (!path)
      return sendError(event, createError({ statusCode: 400, statusMessage: 'not enough data' }));

    try {
      timer.start('db');

      await prisma.note.delete({ where: { path: generateNotePath(user.username, path) } });

      timer.end();
      timer.appendHeader(event);

      return { ok: true };
    }
    catch (error) {
      return sendError(event, createError({ statusCode: 500 }));
    }
  }

  return {};
});
