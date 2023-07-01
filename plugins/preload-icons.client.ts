import { iconExists, loadIcon } from '@iconify/vue';

export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const appConfig = useAppConfig();

    requestIdleCallback(() => {
      for (const iconName of appConfig.iconsToPreload || [])
      // iconify stores local copy of icon in localStorage
        if (!iconExists(iconName)) loadIcon(iconName);
    });
  },
});
