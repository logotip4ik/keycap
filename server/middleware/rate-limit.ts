import { RateLimiter } from 'limiter';
import cache from 'memory-cache';

import type { RateLimiterOpts } from 'limiter';

// 1 hour in milliseconds
const interval = 60 * 60 * 1000;
const limiterOptions: RateLimiterOpts = {
  interval,
  tokensPerInterval: 150,
};

export default defineEventHandler(async (event) => {
  // This will never work correctly
  // limiter is stored for an hour in cache
  // deletion callback is in setTimeout, and node
  // will wait for that timeout before exiting
  // serverless function, so what's the point
  // of it ?
  // https://github.com/jhurliman/node-rate-limiter/blob/main/src/TokenBucket.ts
  // Another option is to use this approach, but still
  // this will store limiter for a 10 seconds timeout,
  // but user can define another interval for limiter
  // package. Then what's the point of interval, from options
  // the limiter will still be removed from cache after 10
  // seconds
  // Probably most valid correct rate limiter for
  // serverless endpoints would be (redis | dragonfly)
  // cache, that will be stored and deleted correctly
  if (event.path?.startsWith('/api')) {
    const identifier = getHeader(event, 'x-forwarded-for');

    let limiter = cache.get(identifier) as RateLimiter | null;

    if (!limiter) {
      limiter = new RateLimiter(limiterOptions);

      // NOTE: migrate to unstorage when native ttl is supported ? https://github.com/unjs/unstorage/issues/13
      cache.put(identifier, limiter, interval);
    }

    let points = 1;

    if (event.path.startsWith('/api/user'))
      points += 2;

    if (!event.context.user)
      points *= 3;

    const remainingPoints = await limiter.removeTokens(points);

    appendHeader(event, 'X-RateLimit-Limit', interval.toString());
    appendHeader(event, 'X-RateLimit-Remaining', remainingPoints.toString());

    if (remainingPoints <= 0)
      return createError({ statusCode: 429 });
  }
});
