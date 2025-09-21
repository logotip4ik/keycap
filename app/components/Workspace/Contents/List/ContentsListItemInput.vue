<script setup lang="ts">
import { useContentsState } from '../config';

const props = defineProps<{
  item: FolderMinimal | NoteMinimal
  parent: FolderWithContents
}>();

const { state: contentsState, isFixed: isContentsFixed } = useContentsState();
const createToast = useToaster();
const { isSmallScreen } = useDevice();
const route = useRoute();

const inputEl = useTemplateRef('inputEl');
const name = ref(props.item.name || '');
const isLoading = ref(false);

const isFolder = checkIsFolder(props.item);
const placeholder = props.item.state === ItemState.Creating
  ? 'note or folder/'
  : isFolder
    ? 'new folder name'
    : 'new note name';
const allowedItemName = `${allowedItemNameRE.source.slice(0, -1)}\\/?$`;

async function handleSubmit() {
  let promise: Promise<FolderMinimal | NoteMinimal | undefined | void>;
  isLoading.value = true;

  // copying some of properties to later send with zeenk
  const state = props.item.state;
  const path = props.item.path;

  if (state === ItemState.Creating) {
    const creationName = name.value.at(-1) === '/' ? name.value.slice(0, -1) : name.value;
    const createAction = creationName.length === name.value.length ? createNote : createFolder;

    // precreated item (which we use for showing input) is always note, so both `createNote` and
    // `createFolder` require second param to be typeof NoteMinimal
    promise = createAction(creationName, props.item, props.parent) as Promise<FolderMinimal | NoteMinimal | undefined>;
  }
  else if (state === ItemState.Editing) {
    promise = renameItem(name.value, props.item);
  }
  else {
    return;
  }

  let hasCatchedError = false;
  await promise
    .catch((error) => {
      hasCatchedError = true;
      sendError(error);
      createToast(error?.data?.message || ERROR_MESSAGES.DEFAULT);
      setTimeout(() => inputEl.value?.focus(), 50);
    })
    .finally(() => isLoading.value = false);

  if (hasCatchedError) {
    return;
  }

  const viewingPath = `/${route.path.slice(2)}`;
  const renamedCurrentlyViewingNote = state === ItemState.Editing
    && !isFolder
    && viewingPath === path;

  contentsState.value = (isSmallScreen.value && (state === ItemState.Creating || renamedCurrentlyViewingNote))
    ? 'hidden'
    : (contentsState.value === 'visible' ? 'hidden' : contentsState.value);

  if (renamedCurrentlyViewingNote) {
    await showItem({
      path: props.item.path, // this will be updated path
    });
  }

  withTiptapEditor((editor) => editor.commands.focus());
}

function handleReset() {
  isContentsFixed.value = false;

  if (isLoading.value) {
    return;
  }

  if (props.item.state === ItemState.Creating) {
    return remove(props.parent.notes, props.item);
  }

  extend(props.item, { state: undefined });
}

onMounted(() => {
  inputEl.value?.focus();
  if (!name.value) {
    inputEl.value?.scrollIntoView({ behavior: 'smooth' });
  }

  isContentsFixed.value = true;
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
    <label class="sr-only" for="contentsListItemInput">
      Item name
      <template v-if="item.state === ItemState.Creating">
        &nbsp;(enter "/" at the end to create folder)
      </template>
    </label>
    <input
      id="contentsListItemInput"
      ref="inputEl"
      v-model="name"
      class="list-item__form__input"
      enterkeyhint="done"
      type="text"
      minlength="2"
      :pattern="allowedItemName"
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
    top: calc(var(--pd-y) * 0.75);
    right: var(--pd-x);

    width: var(--size);
    height: var(--size);

    opacity: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    border-left-color: hsla(var(--text-color-hsl), 0.75);
    border-right-color: hsla(var(--text-color-hsl), 0.75);

    animation: spin 1s infinite linear;
    transition: opacity 0.3s 0.4s;
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
</style>
