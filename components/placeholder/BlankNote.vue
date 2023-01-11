<script setup lang="ts">
const { shortcuts } = useAppConfig();

function normalizeShortcut(shortcut: string) {
  return shortcut.replace(/\$mod/g, 'Ctrl')
}
</script>

<template>
  <div class="blank-note">
    <p class="blank-note__text">
      Create new note or folder

      <br>

      <kbd>{{ normalizeShortcut(shortcuts.new) }}</kbd>
    </p>

    <p class="blank-note__text">
      Show search

      <br>

      <kbd>{{ normalizeShortcut(shortcuts.search) }}</kbd>
    </p>
  </div>
</template>

<style lang="scss">
.blank-note {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  width: 100%;
  height: 100%;

  &__text {
    font-size: min(4.5vw, 45px);
    color: hsla(var(--text-color-hsl), 0.9);
    max-width: 20ch;

    kbd {
      line-height: 1.75;

      white-space: nowrap;

      svg {
        transform: translateY(-5%);
      }
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    display: none;
  }
}
</style>
