import type Webmanifest from '~/server/assets/webmanifest.json';

export default defineEventHandler(async (event) => {
  const storage = useStorage('assets:server');

  const { user } = event.context;

  const manifest: typeof Webmanifest | null = await storage.getItem('webmanifest.json');

  if (!manifest)
    throw createError({ statusCode: 500 });

  if (user)
    manifest.start_url = `/@${user.username}`;

  event.context.logger.warn('test log');

  setHeader(event, 'Content-Type', 'application/manifest+json');

  return manifest;
});
