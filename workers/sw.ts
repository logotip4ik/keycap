import { cacheNames, clientsClaim } from 'workbox-core';
import { registerRoute, setCatchHandler, setDefaultHandler } from 'workbox-routing';
import { cleanupOutdatedCaches } from 'workbox-precaching';
import { NetworkOnly, Strategy } from 'workbox-strategies';
import type { StrategyHandler } from 'workbox-strategies';
import type { ManifestEntry } from 'workbox-build';

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;
declare type ExtendableEvent = any;

self.__WB_DISABLE_DEV_LOGS = true;

const cacheName = cacheNames.runtime;

const buildStrategy = (): Strategy => {
  class CacheNetworkRace extends Strategy {
    _handle(request: Request, handler: StrategyHandler): Promise<Response | undefined> {
      const fetchAndCachePutDone: Promise<Response> = handler.fetchAndCachePut(request);
      const cacheMatchDone: Promise<Response | undefined> = handler.cacheMatch(request);

      return new Promise((resolve, reject) => {
        fetchAndCachePutDone.then(resolve);
        cacheMatchDone.then((response) => response && resolve(response));

        // Reject if both network and cache error or find no response.
        Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
          const [fetchAndCachePutResult, cacheMatchResult] = results;
          if (fetchAndCachePutResult.status === 'rejected' && (cacheMatchResult.status === 'rejected' || !cacheMatchResult.value))
            reject(fetchAndCachePutResult.reason);
        });
      });
    }
  }

  return new CacheNetworkRace();
};

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>;
if (import.meta.env.PROD)
  manifest.push({ revision: Math.random().toString(), url: '/' });

const denylist = [
  /^\/api\//,
  /^\/login$/,
  /^\/register$/,
  // exclude sw: if the user navigates to it, fallback to index.html
  /^\/sw.js$/,
  // exclude webmanifest: has its own cache
  /^\/site.webmanifest$/,
];

const cacheEntries: RequestInfo[] = [];
const manifestURLs: string[] = [];

for (const entry of manifest) {
  let denyCaching = false;

  for (const deny of denylist) {
    if (deny.test(entry.url)) {
      denyCaching = true;
      break;
    }
  }

  if (denyCaching)
    continue;

  // @ts-expect-error taken from example, and it works
  const url = new URL(entry.url, self.location);

  cacheEntries.push(new Request(url.href, {
    credentials: 'same-origin' as any,
  }));

  manifestURLs.push(url.href);
}

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheEntries);
    }),
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  // - clean up outdated runtime cache
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // clean up those who are not listed in manifestURLs
      cache.keys().then((keys) => {
        keys.forEach((request) => {
          if (!manifestURLs.includes(request.url))
            cache.delete(request);
        });
      });
    }),
  );
});

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  buildStrategy(),
);

setDefaultHandler(new NetworkOnly());

// fallback to app-shell for document request
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

// this is necessary, since the new service worker will keep on skipWaiting state
// and then, caches will not be cleared since it is not activated
self.skipWaiting();

clientsClaim();
cleanupOutdatedCaches();
