<script setup lang="ts">
import type { Emoji } from '@emoji-mart/data';
import type { Editor } from '@tiptap/core';

const props = defineProps<{
  editor: Editor
  shouldBeVisible: boolean
  items: Array<Emoji>
  onSelect?: (emoji: Emoji) => void
  onClose: () => void
  getBoundingClientRect?: () => DOMRect
}>();

const emojiPickerEl = useTemplateRef('emojiPickerEl');

const { isVisible, selectedItem } = useSuggestion(emojiPickerEl, props);

function handleKeypress(event: KeyboardEvent) {
  if (!props.shouldBeVisible) {
    return false;
  }

  const target = event.target as HTMLButtonElement;

  if (event.key === 'ArrowDown') {
    const button = emojiPickerEl.value?.querySelector('button');

    button?.focus();

    event.preventDefault();

    return true;
  }
  else if (event.key === 'ArrowUp') {
    props.editor.commands.focus();

    return true;
  }
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    if (!emojiPickerEl.value?.contains(target)) {
      return false;
    }

    const parent = target.parentElement as HTMLLIElement;

    const next = event.key === 'ArrowLeft'
      ? (parent.previousElementSibling || parent.parentElement?.lastElementChild)
      : (parent.nextElementSibling || parent.parentElement?.firstElementChild);

    (next?.firstElementChild as HTMLElement | undefined)?.focus();

    return true;
  }
  else if (event.key === 'Esc' || event.key === 'Escape') {
    props.onClose();
    event.preventDefault();
    event.stopPropagation();

    return true;
  }
  else if (event.key === 'Enter') {
    props.onSelect?.(props.items[selectedItem.value]);
    event.preventDefault();

    return true;
  }
}

function getNativeSkin(emoji: Emoji) {
  return emoji.skins[0].native;
}

useFocusTrap(emojiPickerEl);

defineExpose({ handleKeypress });
</script>

<template>
  <Teleport to="#teleports">
    <WithFadeTransition appear>
      <ul v-show="isVisible" ref="emojiPickerEl" class="emoji-picker fast-fade">
        <li v-for="(emoji, i) in items" :key="emoji.id" class="emoji-picker__item">
          <WithTooltip
            v-slot="{ ref, tooltipId }"
            :tooltip="`:${emoji.id}`"
            :y-offset="3"
          >
            <button
              :ref
              class="emoji-picker__item__button"
              :aria-describedby="tooltipId"
              :aria-selected="selectedItem === i"
              :data-backlight-content="getNativeSkin(emoji)"
              @focus="selectedItem = i"
              @click="onSelect?.(emoji)"
              @keydown="handleKeypress"
            >
              {{ getNativeSkin(emoji) }}
            </button>
          </WithTooltip>
        </li>
      </ul>
    </WithFadeTransition>
  </Teleport>
</template>

<style lang="scss">
.emoji-picker {
  --base-shadow-color: 0, 0, 0;

  display: flex;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  width: max-content;

  padding: 0.4rem 0.5rem;
  margin: 0;

  background-color: hsla(var(--surface-color-hsl), 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid hsla(var(--text-color-hsl), 0.125);
  border-radius: 0.175rem;
  box-shadow:
    1px 1.7px 5.3px rgba(var(--base-shadow-color), 0.032),
    3.4px 5.6px 17.9px rgba(var(--base-shadow-color), 0.048),
    15px 25px 80px rgba(var(--base-shadow-color), 0.08)
  ;

  list-style-type: none;

  @media (prefers-color-scheme: dark) {
    --base-shadow-color: 180, 180, 180;
  }

  &__item {
    & + & {
      margin-left: 0.5rem;
    }

    &__button {
      position: relative;

      font-size: 1.25rem;

      margin: 0;
      padding: 0;

      border: none;
      border-radius: 0.125rem;
      background: none;
      appearance: none;

      cursor: pointer;

      &:is(:focus, [aria-selected=true]) {
        outline: 2px solid hsla(var(--selection-bg-color-hsl), 0.5);
        outline-offset: 0.1rem;
      }

      &::before {
        content: attr(data-backlight-content);

        position: absolute;
        z-index: -1;

        opacity: 0.5;
        filter: blur(5px);
      }

      @media (max-width: $breakpoint-tablet) {
        font-size: 2rem;
      }
    }
  }
}
</style>
