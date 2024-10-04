const UPDATE_WORKER_DELAY = parseDuration('1.5s')!;
const initCallbacks = [
  defineFuzzyWorker,
  preloadDashboardComponents,
  prepareOfflineStorage,
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

export function prepareOfflineStorage() {
}
