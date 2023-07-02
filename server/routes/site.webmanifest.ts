import webmanifest from '~/assets/constants/webmanifest.json';

export default defineEventHandler((event) => {
  const { user } = event.context;

  const manifest = { ...webmanifest } satisfies typeof webmanifest;

  if (user)
    manifest.start_url = `/@${user.username}`;

  setHeader(event, 'Content-Type', 'application/manifest+json');

  return manifest;
});
