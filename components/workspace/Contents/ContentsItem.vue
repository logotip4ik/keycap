<script setup lang="ts">
import { withoutLeadingSlash, withoutTrailingSlash } from 'ufo';

interface Props { item: FolderOrNote; parent: FolderWithContents }
const props = defineProps<Props>();

const route = useRoute();
const isFallbackMode = useFallbackMode();
const notesCache = useNotesCache();
const foldersCache = useFoldersCache();
const mitt = useMitt();
const createToast = useToast();

// TODO: add loading state
const newItemName = ref(props.item.name);

// TODO: add loading state
const menuOptions = shallowReactive({
  opened: false,
  x: 0,
  y: 0,
  actions: [
    { name: 'preload', action: _preloadItem },
    { name: 'rename', action: renameItem },
    { name: 'delete', action: deleteItem },
  ],
});

const isFolder = 'root' in props.item;

const isItemRouteActive = computed(() => decodeURIComponent(route.params.note as string) === props.item.name);

const shouldRefreshItemDisabled = ref(false);
const isItemDisabled = computed(() => {
  if (shouldRefreshItemDisabled.value)
    shouldRefreshItemDisabled.value = false;

  const cache = isFolder ? foldersCache : notesCache;

  return isFallbackMode.value && !cache.has(props.item.path);
});

mitt.on('cache:populated', () => shouldRefreshItemDisabled.value = true);

function _preloadItem() {
  const loadingToast = createToast(`Preloading into cache "${props.item.name}"`,
    { duration: Infinity, type: 'loading' },
  );

  preloadItem(props.item)
    .finally(() => loadingToast.remove());

  menuOptions.opened = false;
}

function renameItem() {
  const update = isFolder ? updateSubfolderInFolder : updateNoteInFolder;

  update(props.item, { editing: true }, props.parent);

  menuOptions.opened = false;

  nextTick(() => {
    (document.querySelector('.item[data-editing="true"] > form > input') as HTMLInputElement | null)?.focus();
  });
}

function deleteItem() {
  const deleteItem = isFolder ? deleteFolder : deleteNote;

  deleteItem(props.item, props.parent);

  menuOptions.opened = false;
}

function handleFormSubmit() {
  if (props.item.creating) {
    const creationName = withoutLeadingSlash(withoutTrailingSlash(newItemName.value));

    const create = creationName.length !== newItemName.value.length ? createFolder : createNote;

    create(creationName, props.item, props.parent);
  }

  else if (props.item.editing) {
    const rename = isFolder ? renameFolder : renameNote;

    rename(newItemName.value, props.item, props.parent);
  }
}

function handleFormCancel() {
  if (props.item.creating)
    return deleteNoteFromFolder(props.item, props.parent);

  const update = isFolder ? updateSubfolderInFolder : updateNoteInFolder;

  update(props.item, { editing: false, creating: false }, props.parent);

  newItemName.value = props.item.name;
}

function handleContextmenu(event: Event) {
  if (isFallbackMode.value) return;

  menuOptions.opened = true;
  menuOptions.x = (event as MouseEvent).clientX;
  menuOptions.y = (event as MouseEvent).clientY;
}
</script>

<template>
  <div
    class="item"
    :class="{ 'item--active': isItemRouteActive, 'item--disabled': isItemDisabled }"
    v-bind="{ 'data-creating': item.creating, 'data-editing': item.editing }"
  >
    <template v-if="item.creating || item.editing">
      <form
        class="item__input__wrapper"
        @submit.prevent="handleFormSubmit"
        @reset.prevent="handleFormCancel"
      >
        <input
          v-model="newItemName"
          class="item__input"
          enterkeyhint="done"
          @blur="handleFormCancel"
          @keydown.esc="handleFormCancel"
        >
      </form>
    </template>

    <template v-else>
      <NuxtLink
        class="item__name"
        :to="generateItemRouteParams(item)"
        :title="item.name"
        @contextmenu.prevent="handleContextmenu"
      >
        <template v-if="isFolder">
          <Icon name="ic:outline-folder" class="item__name__folder-icon" />
        </template>

        <span class="item__name__text">{{ decodeURIComponent(item.name) }}</span>
      </NuxtLink>

      <button class="item__edit" @click="handleContextmenu">
        <Icon name="ic:baseline-more-vert" class="item__delete__icon" />
      </button>
    </template>
  </div>

  <Transition name="fade">
    <LazyWorkspaceContentsItemMenu
      v-if="menuOptions.opened"
      :x="menuOptions.x"
      :y="menuOptions.y"
      :actions="menuOptions.actions"
      class="fast-fade"
      @close="menuOptions.opened = false"
    />
  </Transition>
</template>

<style lang="scss">
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: relative;
  z-index: 1;
  isolation: isolate;

  color: hsla(var(--text-color-hsl), 0.85);

  width: 100%;

  border-left: 0.2rem solid hsla(var(--text-color-hsl), 0);

  transition: border-color .3s, background-color .3s, color .3s;

  @media (hover: hover) {
    color: hsla(var(--text-color-hsl), 0.7);
  }

  &[data-creating="true"],
  &[data-editing="true"] {
    padding: 0.4rem 0.075rem;
  }

  &__input {
    font: inherit;
    line-height: 1.75;
    color: currentColor;

    width: 100%;

    padding: 0 0.25rem;

    border-radius: 0.5rem;
    border: 1px solid hsla(var(--text-color-hsl), 0.25);
    background-color: transparent;

    appearance: none;

    &__wrapper {
      width: calc(100% - 0.5rem);
    }

    &:is(:hover, :focus-visible) {
      outline: none;
      border: 1px solid hsla(var(--text-color-hsl), 0.75);
    }
  }

  &__name {
    align-self: stretch;

    display: flex;
    align-items: center;

    font: inherit;
    text-align: left;
    text-decoration: none;
    color: currentColor;

    width: 100%;
    min-height: 100%;

    padding: 0.75rem 0.35rem;

    appearance: none;
    border-radius: 0;
    border: none;
    background: transparent;

    cursor: pointer;
    overflow: hidden;

    &:focus-visible {
      outline: 2px solid var(--selection-bg-color);
      box-shadow: 0 0 1rem 0 hsla(var(--text-color-hsl), 0.025);
    }

    &__folder-icon {
      margin-right: 0.25rem;

      opacity: 0.75;
    }

    &__text {
      white-space: nowrap;
      text-overflow: ellipsis;

      overflow: hidden;
    }
  }

  &__delete,
  &__edit {
    --button-size-basis: 3vw;
    --button-size-max: 2rem;
    --button-size-min: 1.9rem;

    color: hsla(var(--text-color-hsl), 0.45);

    width: var(--button-size-basis);
    height: var(--button-size-basis);

    max-width: var(--button-size-max);
    min-width: var(--button-size-min);
    max-height: var(--button-size-max);
    min-height: var(--button-size-min);

    margin-block: 0.25rem;
    margin-inline-end: 0.25rem;

    appearance: none;
    border: none;
    border-radius: 0.2rem;
    background-color: transparent;

    cursor: pointer;
    transition: color .3s, background-color .3s;

    @media (hover: hover) {
      color: hsla(var(--text-color-hsl), 0.2);
    }

    &__icon {
      height: 70%;
      width: auto;
    }

    &:is(:hover, :focus-visible) {
      color: #f05545;

      background-color: hsla(var(--text-color-hsl), 0.1);

      transition: color .1s, background-color .1s;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      --button-size-min: 2.5rem;
    }
  }

  &__edit {
    display: none;

    &:is(:hover, :focus-visible) {
      color: var(--text-color);
    }

    @media screen and (max-width: $breakpoint-tablet) {
      display: block;
    }
  }

  &:is(:hover, :focus-visible) {
    color: hsla(var(--text-color-hsl), 1);

    border-color: hsla(var(--text-color-hsl), 0.05);
    background-color: hsla(var(--text-color-hsl), 0.05);

    transition: background-color .1s, color .1s;

    @media screen and (max-width: $breakpoint-tablet) {
      border-color: transparent !important;
    }
  }

  &--active {
    color: var(--text-color);

    border-color: var(--text-color) !important;

    @media screen and (max-width: $breakpoint-tablet) {
      border-color: transparent !important;
    }
  }

  &--disabled {
    color: hsla(var(--text-color-hsl), 0.25);

    pointer-events: none;
  };

  @media screen and (max-width: $breakpoint-tablet) {
    font-size: 1.2rem;
  }
}
</style>
