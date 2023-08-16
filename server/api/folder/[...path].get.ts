import { and, asc, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const query = getQuery(event);
  const path = getRouterParam(event, 'path') || '';

  const folderPath = generateFolderPath(user.username, path);

  const selectParams = getFolderSelectParamsFromEvent(event);

  const drizzle = getDrizzle();
  const isDetailsRequest = typeof query.details !== 'undefined';

  timer.start('db');
  const folder = await drizzle.query.folder
    .findFirst({
      where: and(
        eq(schema.folder.path, folderPath),
        eq(schema.folder.ownerId, user.id),
      ),
      columns: isDetailsRequest
        ? { updatedAt: true, createdAt: true }
        : { id: true, name: true, path: true, root: true },

      with: isDetailsRequest
        ? { }
        : {
            notes: {
              columns: { id: true, name: true, path: true },
              orderBy: [asc(schema.note.name)],
            },
            subfolders: {
              columns: { id: true, name: true, path: true, root: true },
              orderBy: [asc(schema.folder.name)],
            },
          },
    });
  // }).catch(async (err) => {
  //   await event.context.logger.error({ err, msg: 'folder.findFirst failed' });
  // });
  timer.end();

  if (!folder)
    throw createError({ statusCode: 404 });

  timer.appendHeader(event);

  return folder;
});
