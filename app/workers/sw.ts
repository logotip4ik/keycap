import type { ManifestEntry } from 'workbox-build';
import type { StrategyHandler } from 'workbox-strategies';

import { get, set } from 'idb-keyval';
import { cacheNames, clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, Strategy } from 'workbox-strategies';

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

registerRoute(
  ({ url }) => manifestURLs.includes(url.href),
  new CacheNetworkRace(),
);

let workspacePath: string | undefined;
self.addEventListener('message', (event) => {
  if (!event.data) {
    return;
  }

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  else if (event.data.type === 'WORKSPACE_PATH') {
    const payload = event.data.payload as { workspacePath: string };

    workspacePath = payload.workspacePath;
    set('WORKSPACE_PATH', payload.workspacePath);
    caches.open(cacheName).then((cache) => {
      cache.add(payload.workspacePath);
    });
  }
});

const networkFirstHandler = new NetworkFirst();
function workspaceHandlerWithFallback(event: FetchEvent) {
  return Promise.race<Response>([
    networkFirstHandler.handle(event),
    new Promise((_, reject) => setTimeout(reject, 750)),
  ])
    .catch(
      async () => await caches.match(workspacePath!) || Response.error(),
    );
};

self.addEventListener('fetch', async (event) => {
  const { request } = event;

  if (request.destination !== 'document') {
    return;
  }

  if (!workspacePath) {
    workspacePath = await get('WORKSPACE_PATH');
  }

  if (!workspacePath) {
    return;
  }

  const url = new URL(request.url);
  if (url.origin === location.origin && url.pathname.startsWith(workspacePath)) {
    event.respondWith(workspaceHandlerWithFallback(event));
  }
});

clientsClaim();
cleanupOutdatedCaches();
