import parseDuration from 'parse-duration';

interface Info {
  commit: string
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
    version: config.build.version,
    build_time: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(config.build.time),
  };

  if (typeof getQuery(event)[build.id] !== 'undefined') {
    const prisma = getPrisma();

    const [users, notes] = await Promise.all([
      prisma.user.count(),
      prisma.note.count(),
    ]).catch(async (err) => {
      await event.context.logger.error({ err, msg: '(user|note).count failed' });

      return [null, null];
    });

    if (users)
      info.users = users;
    if (notes)
      info.notes = notes;
  }

  return info;
}, {
  swr: true,
  maxAge: parseDuration('24hours', 'second'),
  getKey: (event) => {
    const { build } = useRuntimeConfig(event);

    const prefix = typeof getQuery(event)[build.id] === 'undefined' ? '' : 'guarded-';

    return `${prefix}api-info`;
  },
  shouldInvalidateCache: (event) => {
    const { build } = useRuntimeConfig(event);
    const query = getQuery(event);

    return typeof query[build.id] !== 'undefined'
      && typeof query.invalidateCache !== 'undefined';
  },
});
