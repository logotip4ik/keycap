export function updateServiceWorker() {
  const { $pwa: pwa } = useNuxtApp();
  const createToast = useToast();

  const stopOfflineReady = watch(() => pwa.offlineReady, (ready) => {
    if (ready) {
      createToast('Phewww, now you can work offline', { delay: 550 });
      stopOfflineReady();
    }
  }, { immediate: true });

  watch(() => pwa.needRefresh, (needRefresh) => {
    console.log({ needRefresh });

    if (needRefresh) {
      createToast('Psss... We have some updates', {
        priority: 10,
        duration: 25 * 1000, // 25 seconds
        delay: 550,
        buttons: [
          { text: 'refresh now', onClick: () => pwa.updateServiceWorker() },
          { text: 'nahh, not now', onClick: (t) => t.remove() },
        ],
      });
    }
  }, { immediate: true });
}
