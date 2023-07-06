<script setup lang="ts">
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

import { BubbleMenu } from '@tiptap/vue-3';

import type { Editor } from '@tiptap/core';
import type { Props as TippyProps } from 'tippy.js';

interface Props { editor: Editor }
defineProps<Props>();

const tippyOptions: Partial<TippyProps> = {
  // this element will never be displayed on server, so this should work
  appendTo: document.body,
  zIndex: 2,
  duration: [50, 150],
  theme: 'adaptive',
  animation: 'shift-away',
  arrow: false,
};
</script>

<template>
  <BubbleMenu
    :editor="editor"
    :tippy-options="tippyOptions"
    class="formatter"
  >
    <slot />
  </BubbleMenu>
</template>

<style lang="scss">
.tippy-box[data-theme~='adaptive'] {
  background-color: hsla(var(--surface-color-hsl), 0.95);

  border: 1px solid hsla(var(--text-color-hsl), 0.125);
  box-shadow:
    1px 1.7px 5.3px rgba(0, 0, 0, 0.032),
    3.4px 5.6px 17.9px rgba(0, 0, 0, 0.048),
    15px 25px 80px rgba(0, 0, 0, 0.08)
  ;

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.65);

    backdrop-filter: blur(0.4rem);
  }
}

.tippy-content {
  padding: 0.325rem;
}
</style>
