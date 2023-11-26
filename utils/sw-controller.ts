import parseDuration from 'parse-duration';

export function updateServiceWorker() {
  const { $pwa: pwa } = useNuxtApp();
  const createToast = useToaster();

  watch(() => pwa?.offlineReady, (ready) => {
    if (ready)
      createToast('Phewww, now you can work offline', { delay: 550 });
  }, { immediate: true });

  watch(() => pwa?.needRefresh, (needRefresh) => {
    if (needRefresh) {
      createToast('Psss... We have some updates', {
        priority: 10,
        duration: parseDuration('25 seconds')!,
        delay: 550,
        buttons: [
          { text: 'refresh now', onClick: () => pwa?.updateServiceWorker() },
          { text: 'nahh, not now', onClick: (t) => t.remove() },
        ],
      });
    }
  }, { immediate: true });
}
