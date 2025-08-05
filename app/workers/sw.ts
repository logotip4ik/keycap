import type { ManifestEntry } from 'workbox-build';

import { get, set } from 'idb-keyval';

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

import '@ungap/with-resolvers';

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>;
precacheAndRoute(manifest);
cleanupOutdatedCaches();
clientsClaim();

const {
  promise: workspacePathReady,
  resolve: resolveWorkspacePathReady,
} = Promise.withResolvers<string>();

get('WORKSPACE_PATH').then((path) => {
  if (path) {
    resolveWorkspacePathReady(path);
  }
});

self.addEventListener('message', async (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    // this is needed for `Refresh now` button
    await self.skipWaiting();
  }
  else if (event.data.type === 'WORKSPACE_PATH') {
    const payload = event.data.payload as { workspacePath: string };

    resolveWorkspacePathReady(payload.workspacePath);

    await set('WORKSPACE_PATH', payload.workspacePath);
  }
});

workspacePathReady.then((workspacePath) => {
  const strategy = new NetworkFirst({
    networkTimeoutSeconds: 0.75,
    cacheName: 'workspace-pages',
    plugins: [
      new ExpirationPlugin({
        // 14 days
        maxAgeSeconds: 14 * 24 * 60 * 60,
        maxEntries: 20,
        purgeOnQuotaError: true,
      }),
    ],
  });

  registerRoute(
    ({ url }) => {
      return url.host === self.location.host && url.pathname.startsWith(workspacePath);
    },
    strategy,
  );
});
