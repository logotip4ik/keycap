import type Webmanifest from '~/server/assets/webmanifest.json';

export default defineEventHandler(async (event) => {
  const store = useStorage('assets:server');

  const { user } = event.context;

  const manifest: typeof Webmanifest | null = await store.getItem('webmanifest.json');

  if (!manifest)
    return createError({ statusCode: 500 });

  if (user)
    manifest.start_url = `/@${user.username}`;

  setHeader(event, 'Content-Type', 'application/manifest+json');

  return manifest;
});
