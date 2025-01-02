import type Webmanifest from '#server/assets/webmanifest.json';

export default defineEventHandler(async (event) => {
  const storage = useStorage('assets:server');

  const manifest = await storage.getItem<typeof Webmanifest>('webmanifest.json');

  if (!manifest) {
    throw createError({ status: 500 });
  }

  const { user } = event.context;
  if (user) {
    manifest.start_url = `/@${user.username}`;
  }

  setHeader(event, 'Content-Type', 'application/manifest+json');

  return manifest;
});
