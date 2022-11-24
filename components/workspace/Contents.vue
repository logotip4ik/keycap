<script setup lang="ts">
const folder = useRootFolderContents();

function preCreateNote() {
  if (!folder.value) return;

  const id = BigInt(Math.floor(Math.random() * 1000));
  folder.value.notes.push({ id, name: `test folder ${id}`, creating: true });

  nextTick(() => {
    (document.querySelector('.note[data-creating="true"] > input') as HTMLInputElement | null)?.focus();
  });
}
</script>

<template>
  <template v-if="folder">
    <WorkspaceFolder :folder="folder" />
  </template>
  <template v-else>
    <div />
  </template>

  <button class="workspace__create-button" @click="preCreateNote">
    <Icon name="ic:outline-add" />
  </button>
</template>

<style lang="scss">
.workspace {
  &__create-button {
    --button-size-basis: 25vw;
    --button-size-max: 4rem;

    position: absolute;
    bottom: calc(var(--button-size-max) / 3);
    left: calc(var(--button-size-max) / 3);
    z-index: 1;

    height: var(--button-size-basis);
    width: var(--button-size-basis);

    max-width: var(--button-size-max);
    max-height: var(--button-size-max);

    appearance: none;

    border: none;
    border-radius: 50%;
    background: hsla(var(--text-color-hsl), .7);

    cursor: pointer;
    transition: background-color .3s;

    svg {
      color: hsla(var(--surface-color-hsl), 0.75);

      height: 50%;
      width: auto;

      transition: color .3s;
    }

    &:is(:hover, :focus-visible) {
      background-color: hsla(var(--text-color-hsl), 1);

      svg {
        color: hsla(var(--surface-color-hsl), 1);
      }
    }
  }
}
</style>
