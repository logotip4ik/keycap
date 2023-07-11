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
  getKey: () => {
    const { build, public: _public } = useRuntimeConfig();

    return _public.build.commit + build.id;
  },
  shouldInvalidateCache: (event) => {
    const { build } = useRuntimeConfig();

    return typeof getQuery(event)[build.id] !== 'undefined';
  },
});
