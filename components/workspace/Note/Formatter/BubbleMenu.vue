<script setup lang="ts">
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

import { BubbleMenu } from '@tiptap/vue-3';

import type { Editor } from '@tiptap/core';
import type { Props as TippyProps } from 'tippy.js';

interface Props { editor: Editor }
defineProps<Props>();

const tippyOptions: Partial<TippyProps> = {
  // NOTE: appending to body add scroll to page if tooltip
  // stays at be bottom of the editor and user scrolls up to top
  zIndex: 2,
  duration: [50, 150],
  theme: 'adaptive',
  animation: 'shift-away',
  arrow: false,
};
</script>

<template>
  <BubbleMenu :editor="editor" :tippy-options="tippyOptions" class="formatter">
    <slot />
  </BubbleMenu>
</template>

<style lang="scss">
.tippy-box[data-theme~='adaptive'] {
  --base-shadow-color: 0, 0, 0;

  background-color: hsla(var(--surface-color-hsl), 0.95);
  border: 1px solid hsla(var(--text-color-hsl), 0.125);
  box-shadow:
    1px 1.7px 5.3px rgba(var(--base-shadow-color), 0.032),
    3.4px 5.6px 17.9px rgba(var(--base-shadow-color), 0.048),
    15px 25px 80px rgba(var(--base-shadow-color), 0.08)
  ;

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 200, 200, 200;
  }

  @supports (backdrop-filter: blur(1px)) {
    background-color: hsla(var(--surface-color-hsl), 0.25);

    backdrop-filter: blur(0.75rem);
  }
}

.tippy-content {
  padding: 0.325rem;
}
</style>
