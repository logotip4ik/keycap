<script setup lang="ts">
import { allowedItemNameRE } from '~/server/utils';

interface Props { item: FolderOrNote; parent: FolderWithContents }
const props = defineProps<Props>();

const isFolder = 'root' in props.item;

const inputEl = ref<HTMLInputElement | null>(null);
const name = ref(props.item.name || '');

function handleSubmit() {
  if (props.item.creating) {
    const creationName = name.value.replace(/\//g, '');

    if (!creationName.match(allowedItemNameRE))
      return inputEl.value?.setCustomValidity('name contains invalid characters')
    else
      inputEl.value?.setCustomValidity('');

    const createAction = creationName.length !== name.value.length ? createFolder : createNote;


    createAction(creationName, props.item, props.parent);
  }
  else if (props.item.editing) {
    const renameAction = isFolder ? renameFolder : renameNote;

    renameAction(name.value, props.item, props.parent);
  }
}

function handleReset() {
  if (props.item.creating)
    return deleteNoteFromFolder(props.item, props.parent);

  const updateAction = isFolder ? updateSubfolderInFolder : updateNoteInFolder;

  updateAction(props.item, { editing: false, creating: false }, props.parent);
}

onMounted(() => {
  inputEl.value?.focus();
  inputEl.value?.scrollIntoView();
});
</script>

<template>
  <form class="list-item__form" @submit.prevent="handleSubmit" @reset.prevent="handleReset">
    <label v-once class="list-item__form__label" for="contentsListItemInput">
      Item name (enter "/" at the end to create folder)
    </label>
    <input id="contentsListItemInput" ref="inputEl" v-model="name" class="list-item__form__input" enterkeyhint="done"
      type="text" minlength="2" placeholder="note or folder/..." @blur="handleReset" @keydown.esc="handleReset">
  </form>
</template>

<style lang="scss">
.list-item__form {
  &__label {
    position: absolute;

    width: 0;
    height: 0;

    overflow: hidden;
    pointer-events: none;
  }

  &__input {
    font-family: inherit;
    color: hsla(var(--text-color-hsl), 1);

    width: 100%;

    padding: calc(var(--pd-y) * 0.7) calc(var(--pd-x));

    appearance: none;
    outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
    outline-offset: -1px;
    border: none;
    border-radius: 0.225rem;
    background-color: hsla(var(--text-color-hsl), 0.025);
  }
}
</style>
