import type { TypeOf } from 'suretype';

import { getPrisma } from '~/prisma';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const prisma = getPrisma();

  const path = getRouterParam(event, 'path');

  if (!path)
    return createError({ statusCode: 400 });

  // NOTE: path is actually is not required param for body
  // just to reuse object and thus improve pref, i think it
  // is better to type body as create schema and later set path
  const body = await readBody<TypeOf<typeof folderCreateSchema>>(event);

  body.path = generateFolderPath(user.username, path);

  const validation = useFolderCreateSchema(body);

  if (!validation.ok) {
    return createError({
      statusCode: 400,
      statusMessage: `${validation.errors[0].dataPath.split('.').at(-1)} ${validation.errors[0].message}`,
    });
  }

  const selectParams = getFolderSelectParamsFromEvent(event);

  timer.start('db');
  const folder = await prisma.folder.create({
    data: {
      name: body.name,
      path: body.path,
      owner: { connect: { email: user.email } },
      parent: { connect: { id: toBigInt(body.parentId) } },
    },

    select: { ...selectParams },
  }).catch(() => null);
  timer.end();

  if (!folder)
    return createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 201);

  return { ...folder, notes: [], subfolders: [] };
});
