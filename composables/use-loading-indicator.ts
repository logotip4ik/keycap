import type { RuntimeNuxtHooks } from 'nuxt/app';
import type { HookKeys } from 'hookable';

const isShowingLoading = { v: false };

// https://github.com/nuxt/nuxt/issues/14221#issuecomment-1397723845
export function useLoadingIndicator() {
  return {
    showLoading: createToggle('page:start', true, () => isShowingLoading.v),
    hideLoading: createToggle('page:finish', false, () => !isShowingLoading.v),
  };
};

function createToggle(hookName: HookKeys<RuntimeNuxtHooks>, setValue: any, shouldIgnore: () => any) {
  return () => {
    if (shouldIgnore())
      return;

    const nuxtApp = useNuxtApp();

    nuxtApp.callHook(hookName);
    isShowingLoading.v = setValue;
  };
}
