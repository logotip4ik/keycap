import { createError, getRouterParam, isMethod, sendError } from 'h3';

import type { Note } from '@prisma/client';

import getPrisma from '~/prisma';
import { getUserFromEvent } from '~/server/utils/auth';
import { generateNotePath, toBigInt } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) return sendError(event, createError({ status: 401 }));

  const notePath = getRouterParam(event, 'path') as string;

  const prisma = getPrisma();

  if (isMethod(event, 'POST')) {
    interface BodyNote { content?: string; parentId: string }
    const body = await readBody<BodyNote>(event) || {};

    const path = getRouterParam(event, 'path');

    if (!body.parentId || !path)
      return sendError(event, createError({ status: 400, message: 'not enough data' }));

    try {
      const note = await prisma.note.create({
        data: {
          name: decodeURIComponent(path.split('/').at(-1)), // last route param always should be note name
          content: body.content || '',
          path: generateNotePath(user.username, path),
          owner: { connect: { id: user.id } },
          parent: { connect: { id: toBigInt(body.parentId) } },
        },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });

      return note;
    }
    catch (error) {
      return sendError(event, createError({ status: 500 }));
    }
  }

  if (isMethod(event, 'GET')) {
    try {
      const note = await prisma.note.findFirst({
        where: { path: generateNotePath(user.username, notePath), ownerId: user.id },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });

      if (!note)
        return sendError(event, createError({ status: 404 }));

      return note;
    }
    catch (error) {
      return sendError(event, createError({ status: 500 }));
    }
  }

  if (isMethod(event, 'PUT')) {
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
      updatedNote = await prisma.note.update({
        data,
        where: { path: generateNotePath(user.username, notePath) },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });
    }
    catch {
      return sendError(event, createError({ status: 500 }));
    }

    if (query.getNote === 'true') return updatedNote || {};
    return { status: 'ok' };
  }

  if (isMethod(event, 'DELETE')) {
    const path = getRouterParam(event, 'path');

    if (!path) return sendError(event, createError({ status: 400 }));

    if (!path)
      return sendError(event, createError({ status: 400, message: 'not enough data' }));

    try {
      await prisma.note.delete({ where: { path: generateNotePath(user.username, path) } });

      return { status: 'ok' };
    }
    catch (error) {
      return sendError(event, createError({ status: 500 }));
    }
  }

  return {};
});
