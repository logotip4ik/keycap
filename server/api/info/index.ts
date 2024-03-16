export default defineEventHandler(async (event) => {
  const { build, public: config } = useRuntimeConfig();

  const info: Info = {
    commit: config.build.commit,
    version: config.build.version,
    build_time: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(config.build.time),
  };

  if (getQuery(event)[build.id] !== undefined) {
    const kysely = getKysely();

    const [users, notes] = await kysely
      .transaction()
      .execute(async (tx) => await Promise.all([
        tx.selectFrom('User')
          .select((eb) => eb.fn.countAll<string>().as('count'))
          .executeTakeFirst(),

        tx.selectFrom('Note')
          .select((eb) => eb.fn.countAll<string>().as('count'))
          .executeTakeFirst(),
      ])).catch(async (err) => {
        await logger.error(event, { err, msg: '(user|note).count failed' });

        return [null, null];
      });

    if (users)
      info.users = Number(users.count);
    if (notes)
      info.notes = Number(notes.count);
  }

  return info;
});

interface Info {
  commit: string
  version: string
  build_time: string

  /** @private */
  users?: number
  /** @private */
  notes?: number
}
