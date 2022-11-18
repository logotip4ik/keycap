import { createError, getRouterParam, isMethod, sendError } from 'h3';

import type { Note } from '@prisma/client';

import getPrisma from '~/prisma';
import { getUserFromEvent } from '~/server/utils/auth';
import { generateNotePath } from '~/server/utils';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) return sendError(event, createError({ status: 401 }));

  const notePath = getRouterParam(event, 'path') as string;

  const prisma = getPrisma();

  if (isMethod(event, 'GET')) {
    const note = await prisma.note.findFirst({
      where: { path: generateNotePath(user.username, notePath), ownerId: user.id },
      select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
    });

    return note || {};
  }

  if (isMethod(event, 'PUT')) {
    interface UpdatableFields { name?: string; content?: string }

    const whitelistedFieldUpdates: Array<'name' | 'content'> = ['name', 'content'];
    const fieldsToUpdate = await readBody<UpdatableFields>(event);
    const query = getQuery(event);

    const data: UpdatableFields = {};

    for (const field of whitelistedFieldUpdates)
      if (fieldsToUpdate[field]) data[field] = fieldsToUpdate[field];

    let updatedNote: Omit<Note, 'ownerId' | 'parentId'>;

    try {
      updatedNote = await prisma.note.update({
        data,
        where: { path: generateNotePath(user.username, notePath) },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });
    }
    catch {
      if (query.getNote === 'true') return {};
      return { stats: 'error' };
    }

    if (query.getNote === 'true') return updatedNote || {};
    return { status: 'ok' };
  }

  return {};
});
