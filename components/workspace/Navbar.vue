<script setup lang="ts">
// see https://github.com/vuejs/core/discussions/8626
// this actually feels ok, i guess
// kinda react'y, but it brings better typings
interface Props { onOpenSearch: () => void }
defineProps<Props>();

const route = useRoute();
const user = useUser();
const currentNoteState = useCurrentNoteState();
const isFallbackMode = useFallbackMode();

const isNoteNameEmpty = inject(IsNoteNameEmptyKey);
const isSmallScreen = inject(IsSmallScreenKey);

const isShowingBackButton = computed(() => isSmallScreen!.value && !isNoteNameEmpty!.value);

const headingText = computed(() => {
  if (!user.value) return '';

  if (route.params.note && route.params.note !== BLANK_NOTE_NAME)
    return decodeURIComponent(route.params.note as string);

  if (route.params.folders && route.params.folders.length !== 0) {
    const lastFolder = Array.isArray(route.params.folders) ? route.params.folders.at(-1) : route.params.folders;
    return decodeURIComponent(lastFolder!);
  }

  return `${user.value.username}'s workspace`;
});

const folderRootPath = computed(() => {
  return { ...route, params: { ...route.params, note: BLANK_NOTE_NAME } };
});
</script>

<template>
  <header class="header" aria-labelledby="_current-page">
    <Transition name="header-back-button">
      <NuxtLink
        v-show="isShowingBackButton"
        class="header__button header__button--back"
        :href="folderRootPath"
        aria-label="go up to folder root"
        :aria-hidden="!isShowingBackButton"
      >
        <LazyIconBaselineArrowBack v-once class="header__button__icon" />
      </NuxtLink>
    </Transition>

    <!-- TODO: tell somehow user that, red indicator means no internet connection -->
    <p
      id="_current-page"
      class="header__title"
      :aria-label="`${isNoteNameEmpty ? 'folder' : 'note'} '${headingText}'`"
      :data-note-state="currentNoteState"
      :data-network-connection="!isFallbackMode"
    >
      {{ headingText }}
    </p>

    <button
      class="header__button header__button--search"
      :data-show-back-button="isShowingBackButton"
      aria-label="open quick search"
      @click="onOpenSearch"
    >
      <LazyIconSearchRounded v-once class="header__button__icon" />
    </button>
  </header>
</template>

<style lang="scss">
.header {
  display: flex;
  justify-content: flex-between;
  align-items: center;

  width: 20vw;

  max-width: 250px;
  min-width: 125px;

  min-height: 6rem;

  padding: 0.25rem 1rem;

  overflow: hidden;

  &__title {
    --indicator-size: 0.5rem;
    --indicator-color: transparent;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    position: relative;
    z-index: 1;

    font-size: 1.1rem;

    // NOTE: hide not needed text but show saved indicator
    clip-path: inset(-100% 0 0 -100%);

    &::after,
    &::before {
      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: var(--indicator-size);
      height: var(--indicator-size);

      border-radius: 50%;
      background-color: var(--indicator-color);

      transform: translate(-100%, -50%);

      transition: background-color 0.4s ease, filter 0.4s ease;
    }

    &::before {
      opacity: 0.75;
      filter: blur(5px);
    }

    &[data-note-state="fetching"],
    &[data-note-state="updating"] {
      --indicator-color: goldenrod;
    }

    &[data-note-state="saved"] {
      --indicator-color: limegreen;
    }

    &[data-network-connection="false"] {
      --indicator-color: orangered;
    }
  }

  &__button {
    --button-size-basis: 3rem;

    flex-shrink: 0;

    display: none;
    justify-content: center;
    align-items: center;

    color: hsla(var(--text-color-hsl), 0.85);

    width: var(--button-size-basis);
    height: var(--button-size-basis);

    appearance: none;
    border: none;
    border-radius: 0.2rem;

    cursor: pointer;
    transition: color .3s, background-color .3s, opacity .3s;

    &--back {
      will-change: transform, margin-right, opacity;

      margin-right: 1rem;

      background-color: hsla(var(--text-color-hsl), 0.1);
      box-shadow:
        1px -1px 0.1rem hsla(var(--text-color-hsl), 0.05),
        inset -1px -1px 0.1rem hsla(var(--text-color-hsl), 0.05);
    }

    &--search {
      margin-left: auto;
      margin-right: -0.25rem;

      opacity: 0;
      pointer-events: none;
      background-color: transparent;

      @media screen and (max-width: $breakpoint-tablet) {
        &[data-show-back-button="true"] {
          opacity: 1;
          pointer-events: all;
        }
      }
    }

    &__icon {
      height: 65%;
      width: auto;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      display: flex;
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    width: 100%;

    max-width: unset;
    min-height: unset;
  }
}

.header-back-button-enter-active,
.header-back-button-leave-active {
  transition: opacity, transform, margin-right;
  transition-duration: 0.25s;
}

.header-back-button-leave-to,
.header-back-button-enter-from {
  --inverted-size: calc(-1 * var(--button-size-basis));

  margin-right: var(--inverted-size);

  opacity: 0;

  transform: translate3d(var(--inverted-size), 0px, 0px);
}
</style>
