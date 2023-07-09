import parseDuration from 'parse-duration';

export default defineCachedEventHandler((event) => {
  const { build } = useRuntimeConfig();
  const { buildInfo } = useAppConfig();

  if (typeof getQuery(event)[build.id] !== 'undefined') {
    // TODO: add more info to response ?
  }

  return {
    ...buildInfo,
    time: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(buildInfo.time),
  };
}, {
  swr: true,
  maxAge: parseDuration('24hours', 'second'),
  getKey: () => {
    return useAppConfig().buildInfo.commitSha + useRuntimeConfig().build.id;
  },
  shouldInvalidateCache: (event) => {
    const { build } = useRuntimeConfig();

    return typeof getQuery(event)[build.id] !== 'undefined';
  },
});
