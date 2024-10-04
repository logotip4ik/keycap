const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;
const initCallbacks = [
  defineFuzzyWorker,
  preloadDashboardComponents,
  validateOfflineStorage,
  () => {
    setTimeout(async () => {
      const { registerSWToasts } = await import('~/utils/sw-controller');

      requestIdleCallback(registerSWToasts);
    }, UPDATE_WORKER_DELAY);
  },
];

export function prepareWorkspace() {
  invokeArrayFns(initCallbacks);
}

export function preloadDashboardComponents() {
  requestIdleCallback(() => {
    preloadRouteComponents(`/@a/${BLANK_NOTE_NAME}`);
  });
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
