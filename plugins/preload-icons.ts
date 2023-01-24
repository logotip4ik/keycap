import { iconExists, loadIcon } from '@iconify/vue';

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();

  window.requestIdleCallback(() => {
    for (const iconName of appConfig.iconsToPreload || [])
      // iconify stores local copy of icon in localStorage
      if (!iconExists(iconName)) loadIcon(iconName);
  });
});
