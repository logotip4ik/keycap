import manifestSchema from '~/assets/constants/webmanifest.json';
import { WEEK_IN_SECONDS } from '~/headers.config';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export default defineCachedEventHandler((event) => {
  const { user } = event.context;

  const manifest = { ...manifestSchema } satisfies typeof manifestSchema;

  if (user)
    manifest.start_url += `@${user.username}`;

  return manifest;
}, {
  name: 'manifest',
  swr: true,
  maxAge: ONE_DAY_IN_SECONDS,
  staleMaxAge: WEEK_IN_SECONDS,
  getKey: (event) => event.context.user ? `manifest-${event.context.user.username}` : 'manifest',
  shouldInvalidateCache: (event) => typeof getQuery(event).invalidate !== 'undefined',
});
