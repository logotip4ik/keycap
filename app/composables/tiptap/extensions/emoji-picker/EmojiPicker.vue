<script setup lang="ts">
import type { Emoji } from '@emoji-mart/data';

const props = defineProps<{
  shouldBeVisible: boolean
  items: Array<Emoji>
  onSelect?: (emoji: Emoji) => void
  getBoundingClientRect?: () => DOMRect
}>();

const emojiPickerEl = useTemplateRef('emojiPickerEl');
const selectedEmoji = ref(0);
const floating = shallowRef<Awaited<ReturnType<typeof loadFloatingUi>>>();

const isVisible = computed(() => props.shouldBeVisible && props.items.length > 0);

watch(() => props.items, () => {
  selectedEmoji.value = 0;
});

watch(
  [floating, emojiPickerEl, isVisible],
  ([floating, emojiPicker, isVisible], _, onCleanup) => {
    const { getBoundingClientRect } = props;

    if (!emojiPicker || !isVisible || !getBoundingClientRect || !floating) {
      return;
    }

    floating.computePosition(
      { getBoundingClientRect },
      emojiPicker,
      {
        placement: 'bottom-start',
        middleware: [
          floating.offset(8),
          floating.shift({ padding: 8 }),
          floating.flip(),
        ],
      },
    ).then(({ x, y }) => {
      emojiPicker.style.setProperty('top', `${y}px`);
      emojiPicker.style.setProperty('left', `${x}px`);
    });

    onCleanup(
      on(window, 'keydown', handleKeypress, { capture: true }),
    );
  },
);

function handleKeypress(event: KeyboardEvent) {
  const target = event.target as HTMLButtonElement;

  if (event.key === 'ArrowDown') {
    const button = emojiPickerEl.value?.querySelector('button');

    button?.focus();

    event.preventDefault();
  }
  else if (event.key === 'ArrowUp') {
    withTiptapEditor((editor) => {
      editor.commands.focus();
    });
  }
  else if (
    (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
    && emojiPickerEl.value?.contains(target)
  ) {
    const parent = target.parentElement as HTMLLIElement;

    const next = event.key === 'ArrowLeft'
      ? (parent.previousElementSibling || parent.parentElement?.lastElementChild)
      : (parent.nextElementSibling || parent.parentElement?.firstElementChild);

    (next?.firstElementChild as HTMLElement | undefined)?.focus();
  }
  else if (event.key === 'Enter') {
    props.onSelect?.(props.items[selectedEmoji.value]);

    event.preventDefault();
  }
}

function getNativeSkin(emoji: Emoji) {
  return emoji.skins[0].native;
}

useFocusTrap(emojiPickerEl);

onBeforeMount(() => {
  loadFloatingUi().then((loaded) => {
    floating.value = loaded;
  });
});
</script>

<template>
  <Teleport to="#teleports">
    <WithFadeTransition appear>
      <ul v-if="isVisible" ref="emojiPickerEl" class="emoji-picker">
        <li v-for="(emoji, i) in items" :key="emoji.id" class="emoji-picker__item">
          <WithTooltip
            v-slot="{ ref, tooltipId }"
            :tooltip="emoji.name"
            :y-offset="3"
          >
            <button
              :ref
              class="emoji-picker__item__button"
              :aria-describedby="tooltipId"
              :aria-selected="selectedEmoji === i"
              :data-backlight-content="getNativeSkin(emoji)"
              @focus="selectedEmoji = i"
              @click="onSelect?.(emoji)"
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

  padding: 0.35rem 0.65rem;
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

      &:focus {
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
