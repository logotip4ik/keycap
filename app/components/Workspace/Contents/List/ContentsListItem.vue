<script setup lang="ts">
import { useContentsState } from '../config';

const props = defineProps<{
  item: FolderMinimal | NoteMinimal
  parent: FolderWithContents
  menuTarget: HTMLElement | undefined
  onShowMenu: (target: HTMLElement) => void
}>();

const isFolder = checkIsFolder(props.item);

const route = useRoute();
const { state: contentsState } = useContentsState();
const { isSmallScreen } = useDevice();

const linkComp = useTemplateRef('linkComp');

const itemHref = computed(() => generateItemPath(props.item));
const isActive = computed(() => itemHref.value === route.path);

function unpinIfNeeded() {
  if (isSmallScreen.value && !isFolder) {
    nextTick(() => {
      contentsState.value = 'hidden';
    });
  }
}

let showedCustomContextmenu = false;
function showMenu(event: Event) {
  if (!linkComp.value || showedCustomContextmenu) {
    return;
  }

  showedCustomContextmenu = true;

  const cleanups = [
    on(window, 'click', () => {
      invokeArrayFns(cleanups);
      showedCustomContextmenu = false;
    }, { once: true }),
    on(window, 'contextmenu', (event) => {
      if (linkComp.value?.$el.contains(event.target as HTMLElement)) {
        return;
      }

      invokeArrayFns(cleanups);
      showedCustomContextmenu = false;
    }),
  ];

  props.onShowMenu(linkComp.value.$el);

  event.preventDefault();
}
</script>

<template>
  <NuxtLink
    ref="linkComp"
    :href="itemHref"
    class="list__item"
    :class="{ 'list__item--active': isActive }"
    :aria-label="`open ${isFolder ? 'folder' : 'note'} '${item.name}'`"
    @click="unpinIfNeeded"
    @contextmenu="showMenu"
  >
    <Icon
      v-if="isFolder"
      name="outline-folder"
      class="list__item__icon list__item__icon--folder"
    />

    <span class="list__item__name">
      {{ item.name }}
    </span>

    <button
      v-if="isSmallScreen"
      class="list__item__edit"
      :aria-label="`show ${isFolder ? 'folder' : 'note'} actions`"
      aria-haspopup="menu"
      aria-controls="item-menu"
      @click.prevent.stop="linkComp && onShowMenu(linkComp?.$el)"
    >
      <Icon name="baseline-more-vert" class="list__item__icon list__item__icon--edit" />
    </button>
  </NuxtLink>
</template>

<style lang="scss">
.list__item {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-family: inherit;
  text-decoration: none;
  text-align: left;
  color: hsla(var(--text-color-hsl), 0.85);

  width: 100%;

  padding: calc(var(--pd-y) * 0.75) calc(var(--pd-x));

  appearance: none;
  border-radius: 0.225rem;
  outline: 1px solid transparent;
  outline-offset: -1px;

  transform: rotate(0);
  transition: background-color .1s, color .1s, outline-color .3s, transform 0.1s;

  @media (hover: hover) {
    color: hsla(var(--text-color-hsl), 0.7);
  }

  @media (width <= $sidebar-breakpoint-one) {
    --pd-y: 1.25rem;
  }

  // .router-link-active is not always working with lazy components ?
  &--active,
  &.selected, // This class is toggled by ListItemMenu
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

  &:active {
    transform: scale(0.99);
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

    width: 100%;
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
