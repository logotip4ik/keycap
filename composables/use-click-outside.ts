import type { Ref } from 'vue';

export default (target: Ref<HTMLElement | null>, callback: () => any) => {
  function onClickOutside(event: Event) {
    const eventTarget = event.target as Node;

    if (!target.value?.contains(eventTarget))
      callback();
  }

  watch(target, (target) => {
    if (!target) return;

    window.addEventListener('click', onClickOutside, { passive: true, capture: true });
    window.addEventListener('pointerdown', onClickOutside, { passive: true, capture: true });
  }, { immediate: true });

  onScopeDispose(() => {
    window.addEventListener('click', onClickOutside);
    window.addEventListener('pointerdown', onClickOutside);
  });
};
