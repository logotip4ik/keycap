import { createError, isMethod, readBody, sendError } from 'h3';
import type { Note } from '@prisma/client';

import { getUserFromEvent } from '~/server/utils/auth';
import { toBigInt } from '~/server/utils';
import getPrisma from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event);

  if (!user) return sendError(event, createError({ status: 401 }));

  if (isMethod(event, 'POST')) {
    const body = await readBody<{ name: string; contents?: string; parentId: string }>(event) || {};

    if (!body.name || !body.parentId)
      return sendError(event, createError({ status: 400, message: 'not enough data' }));

    const prisma = getPrisma();

    let note: Pick<Note, 'id' | 'name' | 'content'>;

    try {
      note = await prisma.note.create({
        data: {
          name: body.name,
          content: body.contents || '',
          owner: { connect: { id: user.id } },
          parent: { connect: { id: toBigInt(body.parentId) } },
        },
        select: { id: true, name: true, content: true },
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
