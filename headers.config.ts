import { isDevelopment } from 'std-env';

import type { HTTPMethod } from 'h3';

export const SIX_MONTH_IN_SECONDS = 60 * 60 * 24 * 31 * 6;

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

export const longCacheHeaders = {
  'Cache-Control': `public, immutable, max-age=${SIX_MONTH_IN_SECONDS}, stale-while-revalidate=${SIX_MONTH_IN_SECONDS}`,
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
  'Vary': 'Accept-Encoding, Accept, X-Requested-With',
  ...(isDevelopment ? {} : cspHeaders),
};

export type HeadersType = 'default' | 'assets' | 'api';

export function getHeaders(headersType?: HeadersType) {
  headersType = headersType ?? 'default';

  const headers = { };

  if (isDevelopment) return headers;

  Object.assign(headers, defaultHeaders);

  if (headersType === 'assets')
    Object.assign(headers, longCacheHeaders);

  if (headersType === 'api')
    Object.assign(headers, corsHeaders);

  return headers;
}
