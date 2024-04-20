<script setup lang="ts">
const props = defineProps<{
  item: FolderOrNote
  parent: FolderWithContents
}>();

const { visibility } = useContentsSidebar();
const createToast = useToaster();
const { isSmallScreen } = useDevice();

const inputEl = shallowRef<HTMLInputElement | null>(null);
const name = ref(props.item.name || '');
const isLoading = ref(false);

const isFolder = checkIsFolder(props.item);
const placeholder = props.item.creating
  ? 'note or folder/'
  : isFolder
    ? 'new folder name'
    : 'new note name';

function handleSubmit() {
  let promise: Promise<unknown>;
  isLoading.value = true;

  if (props.item.creating) {
    const creationName = name.value.replace(/\//g, '');
    const createAction = creationName.length === name.value.length ? createNote : createFolder;

    promise = createAction(creationName, props.item, props.parent);
  }
  else if (props.item.editing) {
    const renameAction = isFolder ? renameFolder : renameNote;

    promise = renameAction(name.value, props.item);
  }
  else {
    return;
  }

  promise
    .then(() => {
      visibility.value = isSmallScreen.value
        ? 'hidden'
        : (visibility.value === 'visible' ? 'hidden' : visibility.value);

      useTiptap().withEditor((editor) => editor.commands.focus());
    })
    .catch((error) => createToast(error.data.message || ERROR_MESSAGES.DEFAULT))
    .finally(() => isLoading.value = false);
}

function handleReset() {
  if (props.item.creating) {
    return remove(props.parent.notes, props.item);
  }

  extend(props.item, { editing: false, creating: false });
}

onMounted(() => {
  inputEl.value?.focus();
  inputEl.value?.scrollIntoView();
});
</script>

<template>
  <form
    class="list-item__form"
    aria-live="polite"
    :aria-busy="isLoading"
    @submit.prevent="handleSubmit"
    @reset.prevent="handleReset"
  >
    <label v-once class="sr-only" for="contentsListItemInput">
      Item name (enter "/" at the end to create folder)
    </label>
    <input
      id="contentsListItemInput"
      ref="inputEl"
      v-model="name"
      class="list-item__form__input"
      enterkeyhint="done"
      type="text"
      minlength="2"
      :pattern="allowedClientItemNameRE.source"
      :placeholder="placeholder"
      :disabled="isLoading"
      @blur="handleReset"
      @keydown.esc="handleReset"
    >

    <span aria-hidden="true" class="list-item__form__spinner" />
  </form>
</template>

<style lang="scss">
.list-item__form {
  position: relative;
  isolation: isolate;

  &__input {
    font-family: inherit;
    line-height: inherit;
    color: hsla(var(--text-color-hsl), 1);

    width: 100%;

    padding: calc(var(--pd-y) * 0.75) calc(var(--pd-x));

    appearance: none;
    outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
    outline-offset: -1px;
    border: none;
    border-radius: 0.225rem;
    background-color: hsla(var(--text-color-hsl), 0.025);

    transition: outline-color .3s, color .3s;

    &:user-invalid {
      outline-color: var(--error-color);
    }

    &:disabled {
      color: hsla(var(--text-color-hsl), 0.5);
    }
  }

  &__spinner {
    --size: 1.5rem;

    position: absolute;
    top: calc(var(--pd-y) / 2);
    right: calc(var(--pd-x) / 2);

    width: var(--size);
    height: var(--size);

    opacity: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    border-left-color: hsla(var(--text-color-hsl), 0.75);
    border-right-color: hsla(var(--text-color-hsl), 0.75);

    animation: spin 1s infinite linear;
    transition: opacity 0.3s;
  }

  &[aria-busy="true"] {
    .list-item__form__input {
      filter: blur(1px);
    }

    .list-item__form__spinner {
      opacity: 1;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0)
  }

  to {
    transform: rotate(1turn)
  }
}
</style>
