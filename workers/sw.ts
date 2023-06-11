/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { cacheNames, clientsClaim } from 'workbox-core';
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import { NetworkOnly, StaleWhileRevalidate, Strategy } from 'workbox-strategies';
import { cleanupOutdatedCaches } from 'workbox-precaching';
import type { StrategyHandler } from 'workbox-strategies';
import type { ManifestEntry } from 'workbox-build';

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;
declare type ExtendableEvent = any;

const cacheName = cacheNames.runtime;

const wait = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const buildStrategy = (): Strategy => {
  class CacheNetworkRace extends Strategy {
    _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
      const fetchAndCachePutDone: Promise<Response> = handler.fetchAndCachePut(request);
      const cacheMatchDone: Promise<Response | undefined> = handler.cacheMatch(request);

      return new Promise((resolve, reject) => {
        fetchAndCachePutDone.then((response) => response && resolve(response));
        cacheMatchDone.then((response) => response && wait(250).then(() => resolve(response)));

        // Reject if both network and cache error or find no response.
        Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
          const [fetchAndCachePutResult, cacheMatchResult] = results;
          // @ts-expect-error taken from developer.chrome.com
          if (fetchAndCachePutResult.status === 'rejected' && !cacheMatchResult.value)
            reject(fetchAndCachePutResult.reason);
        });
      });
    }
  }

  return new CacheNetworkRace();
};

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>;

const cacheEntries: RequestInfo[] = [];

const manifestURLs = manifest.map(
  (entry) => {
    // @ts-expect-error taken from vite-pwa-org
    const url = new URL(entry.url, self.location);
    cacheEntries.push(new Request(url.href, {
      credentials: 'same-origin' as any,
    }));
    return url.href;
  },
);

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries);
    }),
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          if (!manifestURLs.includes(request.url))
            cache.delete(request);
        });
      });
    }),
  );
});

const denylist = [
  /^\/$/,
  /^\/login$/,
  /^\/register$/,

  /^\/api\//,
  // exclude sw: if the user navigates to it, fallback to index.html
  /^\/sw.js$/,
  // exclude webmanifest: has its own cache
  /^\/site.webmanifest$/,
];

registerRoute(
  ({ url }) => !denylist.some((deny) => deny.test(url.pathname)) && manifestURLs.includes(url.href),
  buildStrategy(),
);

registerRoute(
  ({ sameOrigin, url }) =>
    sameOrigin && url.pathname.startsWith('/api/search/client'),
  new StaleWhileRevalidate(),
);

setDefaultHandler(new NetworkOnly());

setCatchHandler(({ event }): Promise<Response> => {
  switch ((event as any).request.destination) {
    case 'document':
      return caches.match('/').then((r) => {
        return r ? Promise.resolve(r) : Promise.resolve(Response.error());
      });
    default:
      return Promise.resolve(Response.error());
  }
});

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
