import RateLimiter from 'lambda-rate-limiter';

const INTERVAL = 60000; // 1 minute
const LIMIT = Math.floor((INTERVAL * 2) / 1000); // two per second

const { check: rateLimit } = RateLimiter({
  interval: INTERVAL,
  uniqueTokenPerInterval: LIMIT,
});

// NOTE: https://lihbr.com/posts/rate-limiting-without-overhead-netlify-or-vercel-functions
// cool article that describes problem about rate limiting in serverless functions
export default defineEventHandler(async (event) => {
  if (event.path?.startsWith('/api')) {
    const identifier = getHeader(event, 'x-real-ip') || getHeader(event, 'x-forwarded-for');

    const used = await rateLimit(LIMIT, identifier!).catch(() => LIMIT);

    appendHeader(event, 'X-RateLimit-Limit', LIMIT.toString());
    appendHeader(event, 'X-RateLimit-Remaining', (LIMIT - used).toString());

    // Too many requests
    if (used === null) {
      return createError({
        statusCode: 429,
        statusMessage: 'Too many requests',
      });
    }
  }
});
