<script setup lang="ts">
const { shortcuts } = useAppConfig();
const route = useRoute();
const user = useUser();

const currentFolderPath = computed(() => {
  const folders = Array.isArray(route.params.folders) ? route.params.folders : [];

  const path = folders.map(decodeURIComponent).join('/');

  return path ? `/${path}` : path;
});

function normalizeShortcut(shortcut: string) {
  return shortcut.replace(/\$mod/g, 'Ctrl').replace(/Key/g, '');
}
</script>

<template>
  <div class="welcome">
    <Transition name="fade">
      <p v-if="!currentFolderPath" class="welcome__title">
        Welcome back
      </p>

      <p v-else class="welcome__title">
        Path: {{ currentFolderPath }}
      </p>
    </Transition>

    <div class="welcome__shortcuts">
      <p class="welcome__shortcuts__item">
        <span class="welcome__shortcuts__item__text">
          Create new note or folder
        </span>

        <br>

        <kbd class="welcome__shortcuts__item__shortcut">
          {{ normalizeShortcut(shortcuts.new) }}
        </kbd>
      </p>

      <p class="welcome__shortcuts__item">
        <span class="welcome__shortcuts__item__text">
          Show search
        </span>

        <br>

        <kbd class="welcome__shortcuts__item__shortcut">
          {{ normalizeShortcut(shortcuts.search) }}
        </kbd>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  width: 100%;
  height: 100%;

  padding: 1.75rem;

  &__title {
    font-size: min(4.5vw, 2.75rem);
    max-width: 33ch;
  }

  &__shortcuts {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;

    &__item {
      font-size: min(2.5vw, 1.75rem);
      color: hsla(var(--text-color-hsl), 0.8);

      &__text {
        max-width: 20ch;
      }

      &__shortcut {
        line-height: 1.75;

        white-space: nowrap;

        svg {
          transform: translateY(-5%);
        }
      }
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    display: none;
  }
}
</style>
