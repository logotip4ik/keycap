import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.context.user!;
  const timer = event.context.timer!;

  const path = getRouterParam(event, 'path');

  if (!path)
    throw createError({ statusCode: 400 });

  const folderPath = generateFolderPath(user.username, path);

  if (generateRootFolderPath(user.username) === folderPath)
    return {};

  const drizzle = getDrizzle();

  timer.start('db');
  const folder = await drizzle
    .delete(schema.folder)
    .where(and(
      eq(schema.folder.path, folderPath),
      eq(schema.folder.ownerId, user.id),
    ))
    .execute()
    .catch(async (err) => {
      await event.context.logger.error({ err, msg: 'folder.delete failed' });
    });
  timer.end();

  if (!folder)
    throw createError({ statusCode: 400 });

  timer.appendHeader(event);

  setResponseStatus(event, 204);

  return { ok: true };
});
