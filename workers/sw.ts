import { Strategy } from 'workbox-strategies';
import { cacheNames, clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { cleanupOutdatedCaches } from 'workbox-precaching';
import type { StrategyHandler } from 'workbox-strategies';
import type { ManifestEntry } from 'workbox-build';

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

const cacheName = cacheNames.runtime;

class CacheNetworkRace extends Strategy {
  _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
    const fetchAndCachePutDone: Promise<Response> = handler.fetchAndCachePut(request);
    const cacheMatchDone: Promise<Response | undefined> = handler.cacheMatch(request);

    return new Promise((resolve, reject) => {
      fetchAndCachePutDone.then((response) => response && resolve(response));
      cacheMatchDone.then((response) => response && resolve(response));

      // Reject if both network and cache error or find no response.
      Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
        const [fetchAndCachePutResult, cacheMatchResult] = results;
        if (fetchAndCachePutResult.status === 'rejected'
          && (cacheMatchResult.status === 'rejected' || !cacheMatchResult.value)
        ) {
          reject(fetchAndCachePutResult.reason);
        }
      });
    });
  }
}

// TODO: somehow add current user page to cache. Like
// /@test, so it could actually work without internet
const manifest = self.__WB_MANIFEST as Array<ManifestEntry>;

const cacheEntries: Array<RequestInfo> = [];

const manifestURLs = manifest.map(
  (entry) => {
    // @ts-expect-error taken from vite-pwa-org
    const url = new URL(entry.url, self.location);
    cacheEntries.push(new Request(url.href, {
      credentials: 'same-origin',
    }));
    return url.href;
  },
);

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(cacheEntries)),
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.keys().then((keys) => {
        for (const request of keys) {
          if (!manifestURLs.includes(request.url)) {
            cache.delete(request);
          }
        }
      });
    }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  new CacheNetworkRace(),
);

// TODO: add app-shell for network errors ?
// // fallback to app-shell for document request
// setCatchHandler(({ event }): Promise<Response> => {
//   switch (event.request.destination) {
//     case 'document':
//       return caches.match(fallback).then((r) => {
//         return r ? Promise.resolve(r) : Promise.resolve(Response.error())
//       })
//     default:
//       return Promise.resolve(Response.error())
//   }
// })

clientsClaim();
cleanupOutdatedCaches();
