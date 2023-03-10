import type { RuntimeNuxtHooks } from 'nuxt/app';
import type { HookKeys } from 'hookable';

let isShowingLoadingIndicator = false;

// https://github.com/nuxt/nuxt/issues/14221#issuecomment-1397723845
export default () => {
  return {
    showLoading: createToggle('page:start', true, () => isShowingLoadingIndicator),
    hideLoading: createToggle('page:finish', false, () => !isShowingLoadingIndicator),
  };
};

function createToggle(hookName: HookKeys<RuntimeNuxtHooks>, setValue: any, shouldIgnore: () => any) {
  const nuxtApp = useNuxtApp();

  return () => {
    if (shouldIgnore())
      return;

    nuxtApp.callHook(hookName);
    isShowingLoadingIndicator = setValue;
  };
}
