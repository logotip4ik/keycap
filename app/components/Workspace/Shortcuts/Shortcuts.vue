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

const sections = computed(() => {
  const modK = modKey.value;

  const globalShortcuts = Object.entries(shortcuts)
    .map(([key, shortcut]) => ({
      keys: shortcutsRenames[key as keyof typeof shortcuts] || humanizeShortcut(shortcut, modK),
      desc: shortcutsDescription[key as keyof typeof shortcuts],
    }))
    .sort((a, b) => a.keys.length - b.keys.length);

  const editorShortcuts = [
    { keys: humanizeShortcut('$mod+b', modK), desc: 'Format as bold' },
    { keys: humanizeShortcut('$mod+i', modK), desc: 'Format as italic' },
    { keys: humanizeShortcut('$mod+e', modK), desc: 'Format as code' },
    { keys: humanizeShortcut('$mod+Alt+0', modK), desc: 'Format as paragraph' },
    { keys: humanizeShortcut('$mod+Alt+1', modK), desc: 'Format as heading level 1' },
    { keys: humanizeShortcut('$mod+Alt+2', modK), desc: 'Format as heading level 2' },
    { keys: humanizeShortcut('$mod+Alt+3', modK), desc: 'Format as heading level 3' },
    { keys: humanizeShortcut('$mod+Shift+S', modK), desc: 'Format as strikethrough' },
    { keys: humanizeShortcut('$mod+Shift+H', modK), desc: 'Highlight selection' },
    { keys: humanizeShortcut('$mod+Shift+6', modK), desc: 'Format as quote' },
    { keys: humanizeShortcut('$mod+Shift+7', modK), desc: 'Format as ordered list' },
    { keys: humanizeShortcut('$mod+Shift+8', modK), desc: 'Format as unordered list' },
    { keys: humanizeShortcut('$mod+Shift+L', modK), desc: 'Insert link in selection' },
  ];

  return [
    { name: 'Global shortcuts', shortcuts: globalShortcuts },
    { name: 'Editor shortcuts', shortcuts: editorShortcuts },
  ];
});
</script>

<template>
  <WithBackdrop class="shortcuts__wrapper" @click.self="onClose">
    <WorkspaceModal id="shortcuts-modal" class="shortcuts" @close="onClose">
      <WorkspaceModalCloseButton @click="onClose" />

      <div v-for="section in sections" :key="section.name" class="shortcuts__item">
        <p class="shortcuts__title font-wide">
          {{ section.name }}
        </p>

        <ul class="shortcuts__list">
          <li v-for="shortcut in section.shortcuts" :key="shortcut.keys" class="shortcuts__list__item">
            <kbd>{{ shortcut.keys }}</kbd>

            <hr class="shortcuts__list__item__hr">

            <p class="shortcuts__list__item__desc">
              {{ shortcut.desc }}
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
