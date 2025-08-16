<script setup lang="ts">
defineProps<{
  onClose: () => void
}>();

const { shortcuts } = useAppConfig();
const modKey = useModKey();

const shortcutsDescription: Record<keyof typeof shortcuts, string> = {
  edit: 'Focus Editor',
  new: 'Create new note or folder',
  search: 'Show search',
  contents: 'Open contents sidebar',
  toolbox: 'Open toolbox sidebar',
  scrollToTop: 'Scroll to the top of the note',
  scrollToBottom: 'Scroll to the bottom of the note',
  quickFind: 'Quickly find text in note',
  shortcutsModal: 'Show shortcuts list',
};

const shortcutsRenames: Partial<Record<keyof typeof shortcuts, string>> = {
  shortcutsModal: '?',
};

const humanizedShortcuts = computed(() => {
  return Object.entries(shortcuts)
    .map(([key, shortcut]) => ({
      keys: shortcutsRenames[key as keyof typeof shortcuts] || humanizeShortcut(shortcut, modKey.value),
      desc: shortcutsDescription[key as keyof typeof shortcuts],
    }))
    .sort((a, b) => a.keys.length - b.keys.length);
});

const editorShortcuts = computed(() => ({
  [humanizeShortcut('$mod+b', modKey.value)]: 'Format as bold',
  [humanizeShortcut('$mod+i', modKey.value)]: 'Format as italic',
  [humanizeShortcut('$mod+e', modKey.value)]: 'Format as code',
  [humanizeShortcut('$mod+Alt+0', modKey.value)]: 'Format as paragraph',
  [humanizeShortcut('$mod+Alt+1', modKey.value)]: 'Format as heading level 1',
  [humanizeShortcut('$mod+Alt+2', modKey.value)]: 'Format as heading level 2',
  [humanizeShortcut('$mod+Alt+3', modKey.value)]: 'Format as heading level 3',
  [humanizeShortcut('$mod+Shift+S', modKey.value)]: 'Format as strikethrough',
  [humanizeShortcut('$mod+Shift+H', modKey.value)]: 'Highlight selection',
  [humanizeShortcut('$mod+Shift+6', modKey.value)]: 'Format as quote',
  [humanizeShortcut('$mod+Shift+7', modKey.value)]: 'Format as ordered list',
  [humanizeShortcut('$mod+Shift+8', modKey.value)]: 'Format as unordered list',
  [humanizeShortcut('$mod+Shift+L', modKey.value)]: 'Insert link in selection',
}));
</script>

<template>
  <WithBackdrop class="shortcuts__wrapper" @click.self="onClose">
    <WorkspaceModal id="shortcuts-modal" class="shortcuts" @close="onClose">
      <WorkspaceModalCloseButton @click="onClose" />

      <div class="shortcuts__item">
        <p class="shortcuts__title font-wide">
          Global Shortcuts
        </p>

        <ul class="shortcuts__list">
          <li v-for="shortcut in humanizedShortcuts" :key="shortcut.keys" class="shortcuts__list__item">
            <kbd>{{ shortcut.keys }}</kbd>

            <hr class="shortcuts__list__item__hr">

            <p class="shortcuts__list__item__desc">
              {{ shortcut.desc }}
            </p>
          </li>
        </ul>
      </div>

      <div class="shortcuts__item">
        <p class="shortcuts__title font-wide">
          Editor Shortcuts
        </p>

        <ul class="shortcuts__list">
          <li v-for="(description, shortcut) in editorShortcuts" :key="shortcut" class="shortcuts__list__item">
            <kbd>{{ shortcut }}</kbd>

            <hr class="shortcuts__list__item__hr">

            <p class="shortcuts__list__item__desc">
              {{ description }}
            </p>
          </li>
        </ul>
      </div>
    </WorkspaceModal>
  </WithBackdrop>
</template>

<style lang="scss">
.shortcuts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  align-items: start;
  gap: 2rem;

  padding: 2rem 1.25rem 1.5rem;

  max-width: 1000px;

  @media screen and (max-width: #{$breakpoint-tablet - 100}) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: $breakpoint-tablet) {
      align-items: stretch;
    }
  }

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    min-width: 325px;
  }

  &__title {
    font-size: clamp(1.25rem, 2vw + 0.75rem, 2rem);

    margin: 0 0 2.25rem;
  }

  &__list {
    width: 100%;

    margin: 0;
    padding: 0;

    list-style-type: none;

    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__hr {
        flex: 1;

        width: 100%;
        min-width: 0.75rem;
        height: 0.1rem;

        margin: 0 1rem;

        border: none;
        background-color: hsla(var(--text-color-hsl), 0.1);
      }

      &__desc {
        font-size: 1.1rem;
        text-align: right;

        margin: 0;
      }

      &+& {
        margin-top: 1rem;
      }
    }
  }
}
</style>
