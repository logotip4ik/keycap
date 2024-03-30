import { RateLimitManager } from '@sapphire/ratelimits';

const INTERVAL = parseDuration('1 minute')!;
const LIMIT = Math.floor((INTERVAL * 2) / 1000); // two per second

export default defineEventHandler(async (event) => {
  if (!import.meta.config.benchmarking && event.path?.startsWith('/api')) {
    const limiter = getRateLimiter();
    const identifier = getRequestIP(event, { xForwardedFor: true });

    const rateLimit = limiter.acquire(identifier!);

    if (rateLimit.limited) {
      throw createError({
        status: 429,
        message: 'Too many requests',
      });
    }

    rateLimit.consume();

    setHeader(event, 'X-RateLimit-Limit', LIMIT);
    setHeader(event, 'X-RateLimit-Remaining', rateLimit.remaining);
  }
});

// NOTE: https://lihbr.com/posts/rate-limiting-without-overhead-netlify-or-vercel-functions
// cool article that describes problem about rate limiting in serverless functions
function getRateLimiter() {
  if (!globalThis.rateLimiter)
    globalThis.rateLimiter = new RateLimitManager(INTERVAL, LIMIT);

  return globalThis.rateLimiter;
}

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var rateLimiter: RateLimitManager<string>;
}
