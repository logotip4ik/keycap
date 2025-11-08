import type webmanifest from '#server/assets/webmanifest.json';

type Webmanifest = typeof webmanifest;
interface UserManifest extends Webmanifest {
  shortcuts?: Array<{
    name: string
    short_name: string
    description: string
    url: string
  }>
}

export default defineEventHandler(async (event) => {
  const storage = useStorage('assets:server');

  const m = await storage.getItem<Webmanifest>('webmanifest.json');

  if (!m) {
    throw createError({ status: 500 });
  }

  const manifest = structuredClone(m) as UserManifest;

  const { user } = event.context;
  if (user) {
    manifest.start_url = `/@${user.username}`;

    const recent = await getRecentForUser(user)
      .catch(async (err) => {
        await logger.error(event, { err, msg: 'recent failed' });
      });

    const shortcuts: NonNullable<UserManifest['shortcuts']> = [];

    if (recent) {
      for (const note of recent) {
        shortcuts.push({
          name: `${note.name} note`,
          short_name: note.name,
          description: `Open "${note.name}" note`,
          url: `/@${note.path.substring(1)}`,
        });
      }
    }

    shortcuts.push({
      name: 'Quick search',
      short_name: 'Search',
      description: 'Jump directly into search after application start',
      url: `/@${user.username}?search`,
    });

    manifest.shortcuts = shortcuts;
  }

  setHeader(event, 'Content-Type', 'application/manifest+json');

  return manifest;
});
