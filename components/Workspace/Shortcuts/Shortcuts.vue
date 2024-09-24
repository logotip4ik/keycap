<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';

const props = defineProps<{
  onClose: () => void
}>();

const { shortcuts } = useAppConfig();

const shortcutsComp = shallowRef<ComponentPublicInstance>();

const shortcutsDescription = {
  edit: 'Focus Editor',
  new: 'Create new note or folder',
  search: 'Show search',
  contents: 'Open contents sidebar',
  toolbox: 'Open toolbox sidebar',
} satisfies Record<keyof typeof shortcuts, string>;

const editorShortcuts = {
  '$mod+Alt+0': 'Set paragraph',
  '$mod+Alt+1': 'Set heading level to 1',
  '$mod+Alt+2': 'Set heading level to 2',
  '$mod+Alt+3': 'Set heading level to 3',
};

const modRE = /\$mod/g;
const keyRE = /Key/g;
function humanizeShortcut(shortcut: string) {
  return shortcut.replace(modRE, useModKey()).replace(keyRE, '');
}

useTinykeys({ Escape: props.onClose });
</script>

<template>
  <WithBackdrop class="shortcuts__wrapper" @click.self="onClose">
    <WorkspaceModal ref="shortcutsComp" class="shortcuts">
      <WorkspaceModalCloseButton @click="onClose" />

      <div class="shortcuts__item">
        <p class="shortcuts__title font-wide">
          Global Shortcuts
        </p>

        <ul class="shortcuts__list">
          <li v-for="(shortcut, key) in shortcuts" :key="key" class="shortcuts__list__item">
            <kbd>{{ humanizeShortcut(shortcut) }}</kbd>

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
            <kbd>{{ humanizeShortcut(shortcut) }}</kbd>

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

    & + & {
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
        height: 0.1rem;

        margin: 0 1rem;

        border: none;
        background-color: hsla(var(--text-color-hsl), 0.1);
      }

      &__desc {
        font-size: 1.1rem;
        margin: 0;
      }

      & + & {
        margin-top: 1rem;
      }
    }
  }
}
</style>
