import { RateLimitManager } from '@sapphire/ratelimits';
import invariant from 'tiny-invariant';

const INTERVAL = parseDuration('1 minute')!;
const LIMIT = Math.floor((INTERVAL * 2) / 1000); // two per second

export default defineEventHandler(async (event) => {
  let path = event.path;
  const queryIdx = path.indexOf('?');

  if (queryIdx !== -1) {
    path = path.substring(0, queryIdx);
  }

  let pathFirstPart = path;
  const firstSlashIdx = pathFirstPart.indexOf('/', 1);

  if (firstSlashIdx !== -1) {
    pathFirstPart = pathFirstPart.substring(0, firstSlashIdx);
  }

  const isApiRequest = pathFirstPart === '/api';
  const isLogRequest = pathFirstPart === '/_log';

  if (
    import.meta.config.benchmarking
      || (!isApiRequest && !isLogRequest)
  ) {
    return;
  }

  const limiter = getRateLimiter();
  let identifier = getRequestIP(event, { xForwardedFor: true });

  if (import.meta.dev && !identifier) {
    identifier = 'localhost';
  }

  invariant(identifier, `No identifier defined for path: ${event.path}`);

  // use separate bucket for log requests
  if (isLogRequest) {
    identifier += '_log';
  }

  const rateLimit = limiter.acquire(identifier);

  setHeader(event, 'X-RateLimit-Limit', LIMIT);
  setHeader(event, 'X-RateLimit-Remaining', rateLimit.remaining);
  setHeader(event, 'X-RateLimit-Reset', rateLimit.remainingTime);

  if (rateLimit.limited) {
    throw createError({
      status: 429,
      message: 'Too many requests',
    });
  }

  if (
    path === '/api/auth/register'
    || path === '/api/auth/login'
    || path === '/api/auth/verify-email'
    || path === '/api/auth/code-info'
  ) {
    for (let i = 0; i < 20; i++) {
      rateLimit.consume();
    }
  }
  else {
    rateLimit.consume();
  }
});

// NOTE: https://lihbr.com/posts/rate-limiting-without-overhead-netlify-or-vercel-functions
// cool article that describes problem about rate limiting in serverless functions
function getRateLimiter() {
  if (!globalThis.rateLimiter) {
    globalThis.rateLimiter = new RateLimitManager(INTERVAL, LIMIT);
  }

  return globalThis.rateLimiter;
}

declare global {
  // eslint-disable-next-line vars-on-top
  var rateLimiter: RateLimitManager<string>;
}
