export function updateServiceWorker() {
  const { $pwa: pwa } = useNuxtApp();
  const createToast = useToast();

  const stopOfflineReady = watch(() => pwa.offlineReady, (ready) => {
    if (ready) {
      createToast('Phewww, now you can work offline');
      stopOfflineReady();
    }
  }, { immediate: true });

  watch(() => pwa.needRefresh, (needRefresh) => {
    if (needRefresh) {
      createToast('Psss... We have some updates', {
        priority: 10,
        duration: 25 * 1000, // 25 seconds
        buttons: [
          { text: 'refresh now', onClick: () => pwa.updateServiceWorker() },
          { text: 'nahh, not now', onClick: (t) => t.remove() },
        ],
      });
    }
  }, { immediate: true });
}
