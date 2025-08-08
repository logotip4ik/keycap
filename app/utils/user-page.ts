import { LazyWorkspaceNoteQuickFind } from '#components';

const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;
const initCallbacks = [
  defineFuzzyWorker,
  preloadDashboardComponents,
  validateOfflineStorage,
  setServiceWorkerWorkspacePath,
  registerSWToasts,
];

export function prepareWorkspace() {
  invokeArrayFns(initCallbacks);
}

function setServiceWorkerWorkspacePath() {
  const user = useUser();

  useNuxtApp().hook('service-worker:activated', ({ registration }) => {
    if (!user.value) {
      return;
    }
    registration.active?.postMessage({
      type: 'WORKSPACE_PATH',
      payload: { workspacePath: `/@${user.value.username}` },
    });
  });
}

function preloadDashboardComponents() {
  requestIdleCallback(() => {
    preloadRouteComponents('/@a/a');
    preloadComponent(LazyWorkspaceNoteQuickFind);
  });
}

async function registerSWToasts() {
  const { $pwa: pwa } = useNuxtApp();
  const createToast = useToaster();

  await new Promise((r) => setTimeout(r, UPDATE_WORKER_DELAY));

  const stopOfflineReady = watch(() => pwa?.offlineReady, (ready) => {
    if (!ready) {
      return;
    }

    nextTick(() => stopOfflineReady());

    createToast('Phewww, now you can work offline.', {
      delay: 550,
    });
  }, { immediate: true });

  const stopNeedRefresh = watch(() => pwa?.needRefresh, (needRefresh) => {
    if (!needRefresh) {
      return;
    }

    nextTick(() => stopNeedRefresh());

    createToast('Psss... We have some updates.', {
      priority: 10,
      duration: parseDuration('25 seconds')!,
      delay: 550,
      buttons: [
        { text: 'refresh now', onClick: () => pwa?.updateServiceWorker() },
        { text: 'nahh, not now', onClick: (t) => t.remove() },
      ],
    });
  }, { immediate: true });
}

const currentOfflineStorageVersion = 1;
export function validateOfflineStorage() {
  const fuzzyWorker = getFuzzyWorker();
  const offlineStorage = getOfflineStorage();

  const stop = watchEffect(async () => {
    const worker = fuzzyWorker.value;

    if (!worker) {
      return;
    }

    nextTick(() => stop());

    const version = await offlineStorage.getVersion();
    if (version !== currentOfflineStorageVersion) {
      await offlineStorage.clear();
      await offlineStorage.setVersion(currentOfflineStorageVersion);
    }

    const itemKeys = await offlineStorage.getItemsKeys();

    await Promise.all(itemKeys.map(async (key) => {
      const stillInUse = await worker.hasItemInCache(key);

      if (stillInUse) {
        return;
      }

      return offlineStorage.removeItem(key);
    }));
  });
}
