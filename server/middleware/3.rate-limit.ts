import RateLimiter from 'lambda-rate-limiter';

const INTERVAL = 60000; // 1 minute
const LIMIT = Math.floor((INTERVAL * 2) / 1000); // two per second

// NOTE: https://lihbr.com/posts/rate-limiting-without-overhead-netlify-or-vercel-functions
// cool article that describes problem about rate limiting in serverless functions
export default defineEventHandler(async (event) => {
  if (event.path?.startsWith('/api')) {
    const rateLimit = getRateLimiter();
    const identifier = getHeader(event, 'x-real-ip') || getHeader(event, 'x-forwarded-for');

    const used = await rateLimit(LIMIT, identifier!).catch(() => LIMIT + LIMIT);

    // Too many requests
    if (used > LIMIT) {
      return createError({
        statusCode: 429,
        statusMessage: 'Too many requests',
      });
    }

    appendHeader(event, 'X-RateLimit-Limit', LIMIT.toString());
    appendHeader(event, 'X-RateLimit-Remaining', (LIMIT - used).toString());
  }
});

function getRateLimiter() {
  // @ts-expect-error this should not be there
  if (!global.rateLimiter) {
  // @ts-expect-error again, this should not be there
    global.rateLimiter = RateLimiter({
      interval: INTERVAL,
      uniqueTokenPerInterval: LIMIT,
    });
  }

  // @ts-expect-error again, this should not be there
  return global.rateLimiter.check as RateLimiter.RateLimiter['check'];
}
