import parseDuration from 'parse-duration';

interface Info {
  commit: string
  // TODO: enum ?
  version: string
  build_time: string

  /** @private */
  users?: number
  /** @private */
  notes?: number
}

export default defineCachedEventHandler(async (event) => {
  const { build, public: config } = useRuntimeConfig();

  const info: Info = {
    commit: config.build.commit,
    version: 'v1',
    build_time: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(config.build.time),
  };

  if (typeof getQuery(event)[build.id] !== 'undefined') {
    const prisma = getPrisma();

    const [users, notes] = await Promise.all([
      prisma.user.count({ select: { id: true } }),
      prisma.note.count({ select: { id: true } }),
    ]).catch(() => [null, null]);

    if (users)
      info.users = users.id;
    if (notes)
      info.notes = notes.id;
  }

  return info;
}, {
  swr: true,
  maxAge: parseDuration('24hours', 'second'),
  getKey: (event) => {
    const { build } = useRuntimeConfig();

    const prefix = typeof getQuery(event)[build.id] === 'undefined' ? '' : 'guarded-';

    return `${prefix}api-info`;
  },
  shouldInvalidateCache: (event) => {
    const { build } = useRuntimeConfig();
    const query = getQuery(event);

    return typeof query[build.id] !== 'undefined'
      && typeof query.invalidateCache !== 'undefined';
  },
});
