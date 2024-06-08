<script setup lang="ts">
import type { Editor } from '@tiptap/core';

import { BubbleMenuPlugin } from '~/composables/tiptap/extensions/bubble-menu/plugin';

const props = defineProps<{
  editor: Editor
}>();

const { setting } = useSetting(settings.formatterPosition);

const BubblePluginKey = 'bubbleMenu';
const bubble = ref<HTMLElement | null>(null);

function unregister() {
  props.editor.unregisterPlugin(BubblePluginKey);
}

function register() {
  if (!bubble.value) {
    return;
  }

  props.editor.registerPlugin(
    BubbleMenuPlugin({
      pluginKey: BubblePluginKey,
      editor: props.editor,
      element: bubble.value,
      placement: setting.value,
    }),
  );
}

watch(setting, () => {
  unregister();
  register();
});

onMounted(() => register());
onBeforeUnmount(() => unregister());
</script>

<template>
  <div ref="bubble" class="formatter floating">
    <slot />
  </div>
</template>

<style lang="scss">
.floating {
  --base-shadow-color: 0, 0, 0;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  width: max-content;

  padding: 0.325rem;

  background-color: hsla(var(--surface-color-hsl), 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid hsla(var(--text-color-hsl), 0.125);
  border-radius: 0.175rem;
  box-shadow:
    1px 1.7px 5.3px rgba(var(--base-shadow-color), 0.032),
    3.4px 5.6px 17.9px rgba(var(--base-shadow-color), 0.048),
    15px 25px 80px rgba(var(--base-shadow-color), 0.08)
  ;

  &::before {
    content: '';

    position: absolute;
    inset: 0;
    z-index: -1;

    border-radius: inherit;
  }

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 180, 180, 180;
  }
}
</style>
