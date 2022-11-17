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
    <svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" />
    </svg>
  </button>
</template>

<style lang="scss">
.workspace {
  &__create-button {
    height: 100%;
    width: 100%;

    max-height: 4rem;

    appearance: none;

    border: none;
    border-top: 1px solid hsla(var(--text-color-hsl), .25);
    border-radius: 0;
    background: transparent;

    cursor: pointer;
    transition: background-color .3s;

    svg {
      color: hsla(var(--text-color-hsl), .75);

      height: 50%;
      width: auto;

      transition: color .3s;
    }

    &:is(:hover, :focus-visible) {
      background-color: hsla(var(--text-color-hsl), .05);

      svg {
        color: hsla(var(--text-color-hsl), 1);
      }
    }
  }
}
</style>
