export async function registerSW() {
  // @ts-expect-error no types
  const { registerSW } = await import('virtual:pwa-register') as { registerSW: () => unknown };

  registerSW();
}

export function registerSWToasts() {
  const { $pwa: pwa } = useNuxtApp();
  const createToast = useToaster();

  const stopOfflineReady = watch(() => pwa?.offlineReady, (ready) => {
    if (!ready) {
      return;
    }

    setTimeout(() => {
      createToast('Phewww, now you can work offline', { delay: 550 });
      stopOfflineReady();
    });
  }, { immediate: true });

  const stopNeedRefresh = watch(() => pwa?.needRefresh, (needRefresh) => {
    if (!needRefresh) {
      return;
    }

    setTimeout(() => {
      createToast('Psss... We have some updates', {
        priority: 10,
        duration: parseDuration('25 seconds')!,
        delay: 550,
        buttons: [
          { text: 'refresh now', onClick: () => pwa?.updateServiceWorker() },
          { text: 'nahh, not now', onClick: (t) => t.remove() },
        ],
      });
      stopNeedRefresh();
    });
  }, { immediate: true });
}
