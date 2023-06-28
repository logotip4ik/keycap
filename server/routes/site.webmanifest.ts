import parseDuration from 'parse-duration';

// @ts-expect-error idk what to do with this error
import webmanifest from '~/assets/constants/webmanifest.json';
import { WEEK_IN_SECONDS } from '~/headers.config';

const ONE_DAY_IN_SECONDS = parseDuration('1 day', 'second');

export default defineCachedEventHandler((event) => {
  const { user } = event.context;

  const manifest = { ...webmanifest } satisfies typeof webmanifest;

  if (user)
    manifest.start_url = `/@${user.username}`;

  event.context.logger.log('warn', 'test log');

  setHeader(event, 'Content-Type', 'application/manifest+json');

  return manifest;
}, {
  swr: true,
  maxAge: ONE_DAY_IN_SECONDS,
  staleMaxAge: WEEK_IN_SECONDS,
  getKey: (event) => event.context.user ? `${event.context.user.username}:manifest` : 'manifest',
  shouldInvalidateCache: (event) => typeof getQuery(event).invalidate !== 'undefined',
});
