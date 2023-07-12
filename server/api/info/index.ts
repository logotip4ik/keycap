import parseDuration from 'parse-duration';

export default defineCachedEventHandler((event) => {
  const { build, public: _public } = useRuntimeConfig();

  if (typeof getQuery(event)[build.id] !== 'undefined') {
    // TODO: add more info to response ?
  }

  return {
    ..._public.build,
    time: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(_public.build.time),
  };
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
