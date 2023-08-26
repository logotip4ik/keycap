<script setup lang="ts">
import parseDuration from 'parse-duration';

interface Props { item: FolderOrNote; parent: FolderWithContents }
const props = defineProps<Props>();

const isFolder = 'root' in props.item;

const route = useRoute();
const detailsItem = useCurrentItemForDetails();
const createToast = useToast();
const isFallbackMode = useFallbackMode();
const contentsSidebarState = useContentsSidebarState();

const isSmallScreen = inject(IsSmallScreenKey)!;

const itemHref = computed(() => {
  let path = props.item.path.replace('/', '/@');

  if (isFolder)
    path += `/${BLANK_NOTE_NAME}`;

  return path;
});

const isActive = computed(() => itemHref.value === route.path);

const menuOptions = shallowReactive({
  opened: false,
  x: 0,
  y: 0,
  actions: [
    { name: 'preload', handler: preloadItemWithIndication },
    (!isFolder && { name: 'rename', handler: renameItem }),
    { name: 'show details', handler: showDetails },
    { name: 'delete', needConfirmation: true, handler: deleteItem },
  ].filter(Boolean),
});

function preloadItemWithIndication() {
  const loadingToast = createToast(`Preloading into cache: "${props.item.name}"`, {
    delay: 250,
    duration: parseDuration('0.5 minute'),
    type: 'loading',
  });

  preloadItem(props.item)
    .finally(() => loadingToast.value?.remove());

  menuOptions.opened = false;
}

function renameItem() {
  const update = isFolder ? updateSubfolderInFolder : updateNoteInFolder;

  update(props.item, { editing: true }, props.parent);

  menuOptions.opened = false;

  nextTick(() => {
    // TODO: add input
    // (document.querySelector('.item[data-editing="true"] > form > input') as HTMLInputElement | null)?.focus();
  });
}

function showDetails() {
  detailsItem.value = props.item;

  menuOptions.opened = false;
}

function deleteItem() {
  const deleteItem = isFolder ? deleteFolder : deleteNote;

  deleteItem(props.item, props.parent);

  menuOptions.opened = false;
}

function showMenu(event: Event) {
  if (isFallbackMode.value) return;

  menuOptions.opened = true;
  menuOptions.x = (event as MouseEvent).clientX;
  menuOptions.y = (event as MouseEvent).clientY;
}

function unpinIfNeeded() {
  if (isSmallScreen && !isFolder)
    contentsSidebarState.value = 'hidden';
}
</script>

<template>
  <li class="list__item__wrapper">
    <!-- TODO: add input -->
    <!-- NOTE: previously `li` in contents list would wrap contents list item.
    This would solve some issues, like animation with lazy component -->
    <NuxtLink
      :href="itemHref"
      class="list__item"
      :class="{ 'list__item--active': isActive }"
      :aria-label="`open ${isFolder ? 'folder' : 'note'} '${item.name}'`"
      @click="unpinIfNeeded"
      @contextmenu.prevent="showMenu"
    >
      <LazyIconOutlineFolder
        v-if="isFolder"
        class="list__item__icon list__item__icon--folder"
      />

      <span class="list__item__name">
        {{ item.name }}
      </span>

      <button
        v-if="isSmallScreen"
        class="list__item__edit"
        :aria-label="`show ${isFolder ? 'folder' : 'note'} actions`"
        @click.prevent.stop="showMenu"
      >
        <LazyIconBaselineMoreVert v-once class="list__item__icon list__item__icon--edit" />
      </button>
    </NuxtLink>

    <Teleport to="body">
      <Transition name="fade">
        <LazyWorkspaceContentsListItemMenu
          v-if="menuOptions.opened"
          :x="menuOptions.x"
          :y="menuOptions.y"
          :actions="menuOptions.actions"
          class="fast-fade"
          @close="menuOptions.opened = false"
        />
      </Transition>
    </Teleport>
  </li>
</template>

<style lang="scss">
.list__item {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  font: inherit;
  text-decoration: none;
  text-align: left;
  color: hsla(var(--text-color-hsl), 0.85);

  width: 100%;

  padding: calc(var(--pd-y) * 0.75) calc(var(--pd-x));

  appearance: none;
  border-radius: 0.225rem;
  outline: 1px solid transparent;
  outline-offset: -1px;

  transition: background-color .1s, color .1s, outline-color .3s;

  @media (hover: hover) {
    color: hsla(var(--text-color-hsl), 0.7);
  }

  @media (width <= $sidebar-breakpoint-one) {
    --pd-y: 1.25rem;
  }

  &__wrapper {
    scroll-snap-align: start;

    &:not(:first-child) {
      margin-top: calc(var(--pd-y) / 5);
    }
  }

  // .router-link-active is not always working with lazy components ?
  &--active,
  &:is(:hover, :focus-visible) {
    color: hsla(var(--text-color-hsl), 1);

    background-color: hsla(var(--text-color-hsl), 0.045);

    transition-duration: 0;
  }

  &--active {
    color: hsla(var(--text-color-hsl), 1) !important;
    background-color: hsla(var(--text-color-hsl), 0.025);
    outline-color: hsla(var(--selection-bg-color-hsl), 0.35);
  }

  &__icon {
    flex-shrink: 0;

    width: 1.25rem;
    height: auto;

    opacity: 0.75;

    &--folder {
      margin-right: calc(var(--pd-x) * 0.66);
    }
  }

  &__name {
    white-space: nowrap;
    text-overflow: ellipsis;

    overflow: hidden;
  }

  &__edit {
    --size: max(41px, 2vw);

    height: var(--size);
    width: var(--size);

    margin: calc(-0.75 * var(--pd-y)) calc(-1 * var(--pd-x));
    margin-left: auto;
    padding: 0;

    appearance: none;
    border: none;
    border-radius: inherit;
    background-color: transparent;
  }
}
</style>
