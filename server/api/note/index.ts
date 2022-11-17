import { createError, isMethod, readBody, sendError } from 'h3';
import type { Note } from '@prisma/client';

import { getUserFromEvent } from '~/server/utils/auth';
import { generateNotePath, toBigInt } from '~/server/utils';
import getPrisma from '~/prisma';

interface BodyNote {
  name: string
  path: string
  content?: string
  parentId: string
}

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) return sendError(event, createError({ status: 401 }));

  if (isMethod(event, 'POST')) {
    const body = await readBody<BodyNote>(event) || {};

    if (!body.name || !body.parentId || !body.path)
      return sendError(event, createError({ status: 400, message: 'not enough data' }));

    const prisma = getPrisma();

    let note: Pick<Note, 'id' | 'name' | 'content'>;

    try {
      note = await prisma.note.create({
        data: {
          name: body.name,
          content: body.content || '',
          path: generateNotePath(user.username, body.path),
          owner: { connect: { id: user.id } },
          parent: { connect: { id: toBigInt(body.parentId) } },
        },
        select: { id: true, name: true, content: true, path: true, updatedAt: true, createdAt: true },
      });
    }
    catch (error) {
      console.warn(error);

      return sendError(event, createError({ status: 500 }));
    }

    return note;
  }

  return {};
});
