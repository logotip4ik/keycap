<script setup lang="ts">
defineProps<{
  onClose: () => void
}>();

const { shortcuts } = useAppConfig();
const modKey = useModKey();

const humanizedShortcuts = computed(() => {
  const humanizedShortcuts = {} as typeof shortcuts;

  for (const key in shortcuts) {
    const shortcut = shortcuts[key as keyof typeof shortcuts];

    humanizedShortcuts[key as keyof typeof shortcuts] = humanizeShortcut(shortcut, modKey.value);
  }

  return humanizedShortcuts;
});

const shortcutsRenames: Partial<Record<keyof typeof shortcuts, string>> = {
  shortcutsModal: '?',
};

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

const editorShortcuts = computed(() => ({
  [humanizeShortcut('$mod+Alt+0', modKey.value)]: 'Set paragraph',
  [humanizeShortcut('$mod+Alt+1', modKey.value)]: 'Set heading level to 1',
  [humanizeShortcut('$mod+Alt+2', modKey.value)]: 'Set heading level to 2',
  [humanizeShortcut('$mod+Alt+3', modKey.value)]: 'Set heading level to 3',
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
          <li v-for="(shortcut, key) in humanizedShortcuts" :key="key" class="shortcuts__list__item">
            <kbd>{{ shortcutsRenames[key] || shortcut }}</kbd>

            <hr class="shortcuts__list__item__hr">

            <p class="shortcuts__list__item__desc">
              {{ shortcutsDescription[key] }}
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
  padding: 2rem 1.25rem 1.5rem;

  max-width: #{$breakpoint-tablet - 200};

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

    width: 100%;

    &+& {
      margin-top: 1.5rem;
    }
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
        margin: 0;
      }

      &+& {
        margin-top: 1rem;
      }
    }
  }
}
</style>
