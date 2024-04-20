<script setup lang="ts">
const { shortcuts } = useAppConfig();

const shortcutsDescription = {
  edit: 'Focus Editor',
  new: 'Create new note or folder',
  search: 'Show search',
  contents: 'Open contents sidebar',
  toolbox: 'Open toolbox sidebar',
} satisfies Record<keyof typeof shortcuts, string>;

function humanizeShortcut(shortcut: string) {
  return shortcut.replace(/\$mod/g, getModKey()).replace(/Key/g, '');
}
</script>

<template>
  <div v-once class="welcome__shortcuts">
    <p
      v-for="(shortcut, name) in shortcuts"
      :key="name"
      class="welcome__shortcuts__item"
    >
      <span class="welcome__shortcuts__item__desc">
        {{ shortcutsDescription[name] }}
      </span>

      <br>

      <kbd class="welcome__shortcuts__item__shortcut">
        {{ humanizeShortcut(shortcut) }}
      </kbd>
    </p>
  </div>
</template>

<style lang="scss">
.welcome__shortcuts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.75rem;

  width: 90%;
  max-width: $breakpoint-tablet - 100px;

  margin-bottom: -5vh;
  margin-bottom: -5svh;

  @media (width <= $breakpoint-tablet) {
    display: none;
  }

  &__item {
    font-size: min(2.5vw, 1.175rem);
    text-align: center;
    font-weight: 300;
    color: hsla(var(--text-color-hsl), 0.5);

    margin: 0;

    transition: color .3s;

    &:hover {
      color: hsla(var(--text-color-hsl), 0.75);
    }

    &__desc {
      display: inline-block;

      max-width: 20ch;

      margin-bottom: 0.5rem;
    }

    &__shortcut {
      font-size: 90%;

      white-space: nowrap;

      svg {
        transform: translateY(-5%);
      }
    }
  }
}
</style>
