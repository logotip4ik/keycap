import type { HTTPHeaderName, HTTPMethod } from 'h3';

import { destr } from 'destr';
import parseDuration from 'parse-duration';
import { isCI } from 'std-env';
import invariant from 'tiny-invariant';

const turnstileEnabled = destr(process.env.FEATURE_TURNSTILE) === true;

const ZEENK_SITE = process.env.NUXT_PUBLIC_ZEENK_SITE;

const CorsOrigin = process.env.NUXT_PUBLIC_SITE || '*';
const CorsMethods = ['GET', 'OPTIONS', 'PATCH', 'POST', 'DELETE'] satisfies Array<HTTPMethod>;
const CorsHeaders = ['Content-Type', 'Accept', 'x-keycap-protect'];

const corsHeaders = {
  'Access-Control-Allow-Origin': CorsOrigin,
  'Access-Control-Allow-Methods': CorsMethods.join(', '),
  'Access-Control-Allow-Headers': CorsHeaders.join(', '),
  'Access-Control-Max-Age': parseDuration('24 hours', 's')?.toString(),
} satisfies HeaderObject;

const cspHeaders = {
  'Content-Security-Policy': [
    'default-src \'self\'',
    `connect-src \'self\' wss://${ZEENK_SITE}`,
    `script-src 'self' 'unsafe-inline' ${turnstileEnabled ? 'https://challenges.cloudflare.com' : ''}`.trim(),
    'style-src \'self\' \'unsafe-inline\'',
    'object-src \'none\'',
    turnstileEnabled && 'frame-src https://challenges.cloudflare.com',
    'upgrade-insecure-requests',
  ].filter(Boolean).join('; '),
} satisfies HeaderObject;

// basically helmet defaults with some customizations
const defaultHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Origin-Agent-Cluster': '?1',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '0',
  'Keep-Alive': '5',
  'Referrer-Policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Vary': 'Origin, Accept-Encoding, Accept, X-Requested-With, X-Authorized',
  ...(isCI ? cspHeaders : {}),
} satisfies HeaderObject;

interface NoteViewHeaderOptions {
  isr: number
  /** @default isr */
  staleWhileRevalidate?: number
}
type HeaderObject = Partial<Record<HTTPHeaderName, string | undefined>>;
type HeadersType = 'default' | 'assets' | 'api' | 'api-info' | 'webmanifest' | 'og' | 'fonts' | 'cachable-images';
type HeadersOptions = NoteViewHeaderOptions | unknown;

export function getHeaders(
  headersOptions?: HeadersType | { type: HeadersType, opts: HeadersOptions },
): Record<string, string | undefined> {
  const type = typeof headersOptions === 'object'
    ? headersOptions.type
    : (headersOptions ?? 'default');

  const headers: HeaderObject = { ...defaultHeaders };

  if (!isCI) {
    return headers;
  }

  switch (type) {
    case 'fonts':
    case 'assets': {
      const halfAYear = parseDuration('0.5 year', 'second')!;

      const assetsCacheOptions = {
        private: false,
        immutable: true,
        maxAge: halfAYear,
        staleWhileRevalidate: halfAYear,
      } satisfies CacheControlHeaderOptions;

      Object.assign(headers, makeCacheControlHeader(assetsCacheOptions));
      Object.assign(headers, makeCacheControlHeader({
        ...assetsCacheOptions,
        CDN: true,
      }));

      break;
    }

    case 'api': {
      Object.assign(headers, corsHeaders);
      Object.assign(headers, makeCacheControlHeader({
        private: true,
        maxAge: 1,
      }));

      break;
    }

    case 'api-info': {
      Object.assign(headers, corsHeaders);
      Object.assign(headers, makeCacheControlHeader({
        private: false,
        maxAge: parseDuration('1 hour', 'second')!,
        staleWhileRevalidate: parseDuration('1 day', 'second')!,
        CDN: true,
      }));

      break;
    }

    case 'webmanifest': {
      Object.assign(headers, makeCacheControlHeader({
        private: true,
        maxAge: 0,
        mustRevalidate: true,
      }));

      break;
    }

    case 'og': {
      const ogCacheOptions = {
        private: false,
        immutable: true,
        maxAge: parseDuration('1 week', 's')!,
        staleWhileRevalidate: parseDuration('1 month', 's')!,
      } satisfies CacheControlHeaderOptions;

      Object.assign(headers, makeCacheControlHeader(ogCacheOptions));
      Object.assign(headers, makeCacheControlHeader({
        ...ogCacheOptions,
        CDN: true,
      }));

      break;
    }

    case 'cachable-images': {
      const cacheOptions = {
        private: false,
        immutable: true,
        maxAge: parseDuration('1 week', 's')!,
      };
      Object.assign(headers, makeCacheControlHeader(cacheOptions));
      Object.assign(headers, makeCacheControlHeader({
        ...cacheOptions,
        CDN: true,
      }));

      break;
    }
  }

  return headers;
}

export function getCachedAssetHeaders(time: string) {
  const headers = {};

  const seconds = parseDuration(time, 's');

  invariant(seconds);

  Object.assign(headers, makeCacheControlHeader({
    private: false,
    immutable: true,
    maxAge: seconds,
  }));

  Object.assign(headers, makeCacheControlHeader({
    private: false,
    immutable: true,
    maxAge: seconds,
    CDN: 'cf',
  }));

  return headers;
}

interface CacheControlHeaderOptions {
  private: boolean
  immutable?: boolean
  mustRevalidate?: boolean
  /** in seconds */
  maxAge: number
  /** in seconds */
  staleWhileRevalidate?: number
  CDN?: boolean | 'vc' | 'cf'
}
function makeCacheControlHeader(opts: CacheControlHeaderOptions) {
  const values: Array<string> = [];

  values.push(opts.private ? 'private' : 'public');

  if (opts.immutable === true) {
    values.push('immutable');
  }

  values.push(`max-age=${opts.maxAge}`);

  if (opts.staleWhileRevalidate) {
    values.push(`stale-while-revalidate=${opts.staleWhileRevalidate}`);
  }

  if (opts.mustRevalidate) {
    values.push(`must-revalidate`);
  }

  const headerName = ['Cache', 'Control'];

  if (opts.CDN) {
    headerName.unshift('CDN');
  }

  if (opts.CDN === 'cf') {
    headerName.unshift('Cloudflare');
  }

  if (opts.CDN === 'vc') {
    headerName.unshift('Vercel');
  }

  return {
    [headerName.join('-')]: values.join(', '),
  };
}
