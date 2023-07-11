import { isDevelopment } from 'std-env';
import parseDuration from 'parse-duration';

import type { HTTPMethod } from 'h3';

export const WEEK_IN_SECONDS = parseDuration('1 week', 'second')!;
export const SIX_MONTHS_IN_SECONDS = parseDuration('0.5 year', 'second')!;

export const CorsOrigin = process.env.SITE_ORIGIN || '*';
export const CorsMethods = ['GET', 'OPTIONS', 'PATCH', 'POST', 'DELETE'] satisfies HTTPMethod[];
export const CorsHeaders = ['Origin', 'Content-Type', 'Accept'];

export const corsHeaders = {
  'Access-Control-Allow-Origin': CorsOrigin,
  'Access-Control-Allow-Methods': CorsMethods.join(', '),
  'Access-Control-Allow-Headers': CorsHeaders.join(', '),
};

export const cspHeaders = {
  'Content-Security-Policy': [
    'default-src \'self\';',
    'connect-src https: \'self\';',
    'script-src \'unsafe-inline\' \'self\';',
    'script-src-elem \'unsafe-inline\' \'self\';',
    'style-src \'unsafe-inline\' \'self\';',
    'object-src \'none\';',
    'upgrade-insecure-requests',
  ].join(' '),
};

// basically helmet defaults with some customizations
export const defaultHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
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
  'Vary': 'Accept-Encoding, Accept, X-Requested-With, X-Authorized',
  ...makeCacheControlHeader({ private: false, maxAge: 2, staleWhileRevalidate: 4 }),
  ...(isDevelopment ? {} : cspHeaders),
};

export interface NoteViewHeaderOptions {
  isr: number
  /**
   * @default isr
   */
  staleWhileRevalidate?: number
}
export type HeadersType = 'default' | 'assets' | 'api' | 'note-view' | 'webmanifest';
export type HeadersOptions = NoteViewHeaderOptions | unknown;

export function getHeaders(headersOptions?: HeadersType | { type: HeadersType; opts: HeadersOptions }) {
  const isObject = typeof headersOptions === 'object';

  const type: HeadersType = isObject ? headersOptions.type : (headersOptions ?? 'default');

  const headers = { };

  if (isDevelopment) return headers;

  Object.assign(headers, defaultHeaders);

  if (type === 'assets') {
    const assetsCacheOptions: CacheControlHeaderOptions = {
      private: false,
      immutable: true,
      maxAge: SIX_MONTHS_IN_SECONDS,
      staleWhileRevalidate: SIX_MONTHS_IN_SECONDS,
    };

    Object.assign(headers, makeCacheControlHeader(assetsCacheOptions));

    assetsCacheOptions.CDN = true;

    Object.assign(headers, makeCacheControlHeader(assetsCacheOptions));
  }

  if (type === 'api') {
    Object.assign(headers, corsHeaders);
    Object.assign(headers, makeCacheControlHeader({
      private: true,
      maxAge: 1,
    }));
  }

  if (type === 'note-view') {
    const options = (isObject ? headersOptions.opts : {}) as NoteViewHeaderOptions;

    const viewCacheOptions: CacheControlHeaderOptions = {
      private: false,
      maxAge: options.isr,
      staleWhileRevalidate: options.isr,
    };

    Object.assign(headers, makeCacheControlHeader(viewCacheOptions));

    viewCacheOptions.CDN = true;

    Object.assign(headers, makeCacheControlHeader(viewCacheOptions));
  }

  if (type === 'webmanifest') {
    const manifestCacheOptions: CacheControlHeaderOptions = {
      private: true,
      maxAge: parseDuration('1 day', 'second')!,
    };

    Object.assign(headers, makeCacheControlHeader(manifestCacheOptions));
  }

  return headers;
}

export interface CacheControlHeaderOptions {
  private: boolean
  immutable?: boolean
  /**
   * in seconds
   */
  maxAge: number
  /**
   * in seconds
   */
  staleWhileRevalidate?: number
  CDN?: boolean | 'vc' | 'cf'
}
export function makeCacheControlHeader(opts: CacheControlHeaderOptions) {
  const values: string[] = [];

  values.push(opts.private ? 'private' : 'public');

  if (opts.immutable === true)
    values.push('immutable');

  values.push(`max-age=${opts.maxAge}`);

  if (opts.staleWhileRevalidate)
    values.push(`stale-while-revalidate=${opts.staleWhileRevalidate}`);

  const headerName = ['Cache', 'Control'];

  if (opts.CDN)
    headerName.unshift('CDN');

  if (opts.CDN === 'cf')
    headerName.unshift('Cloudflare');

  if (opts.CDN === 'vc')
    headerName.unshift('Vercel');

  return {
    [headerName.join('-')]: values.join(', '),
  };
}
