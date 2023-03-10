<script setup lang="ts">
import { blankNoteName } from '~/assets/constants';
import breakpoints from '~/assets/constants/breakpoints';

interface Emits { (event: 'openSearch'): void }
defineEmits<Emits>();

const route = useRoute();
const user = useUser();
const device = useDevice();
const currentNoteState = useCurrentNoteState();
const isFallbackMode = useFallbackMode();

const canShowBackButton = computed(() => {
  const isServerSide = process.server;
  let canShow = true;

  if (isServerSide)
    canShow = device.isMobileOrTablet;
  else if (window.innerWidth > breakpoints.tablet)
    canShow = false;

  return canShow && (route.params.note && route.params.note !== blankNoteName);
});

const headingText = computed(() => {
  if (!user.value) return '';

  if (route.params.note && route.params.note !== blankNoteName)
    return decodeURIComponent(route.params.note as string);

  if (route.params.folders && route.params.folders.length !== 0) {
    const lastFolder = Array.isArray(route.params.folders) ? route.params.folders.at(-1) : route.params.folders;
    return decodeURIComponent(lastFolder!);
  }

  return `${user.value.username}'s workspace`;
});

async function showFolderContents() {
  await navigateTo({ ...route, params: { ...route.params, note: blankNoteName } });
}
</script>

<template>
  <nav class="nav">
    <Transition name="nav-back-button">
      <button
        v-show="canShowBackButton"
        class="nav__button nav__button--back"
        @click="showFolderContents"
      >
        <Icon name="ic:baseline-arrow-back" class="nav__button__icon" />
      </button>
    </Transition>

    <!-- TODO: tell somehow user that, red indicator means no internet connection -->
    <p class="nav__heading" :data-note-state="currentNoteState" :data-network-connection="!isFallbackMode">
      {{ headingText }}
    </p>

    <button
      class="nav__button nav__button--search"
      :data-show-back-button="canShowBackButton"
      @click="$emit('openSearch')"
    >
      <Icon name="search" class="nav__button__icon" />
    </button>
  </nav>
</template>

<style lang="scss">
.nav {
  display: flex;
  justify-content: flex-between;
  align-items: center;

  width: 20vw;

  max-width: 250px;
  min-width: 125px;

  min-height: 6rem;

  padding: 0.25rem 1rem;

  &__heading {
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

    display: none;

    color: hsla(var(--text-color-hsl), 0.85);

    width: var(--button-size-basis);
    height: var(--button-size-basis);

    appearance: none;
    border: none;
    border-radius: 0.2rem;

    cursor: pointer;
    transition: color .3s, background-color .3s, opacity .3s;

    &--back {
      margin-right: 1rem;

      background-color: hsla(var(--text-color-hsl), 0.1);
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
      height: 70%;
      width: auto;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      display: block;
    }
  }

  @media screen and (max-width: $breakpoint-tablet) {
    width: 100%;

    max-width: unset;
    min-height: unset;
  }
}

.nav-back-button-enter-active,
.nav-back-button-leave-active {
  transition: opacity .3s, transform .3s, margin-right .3s;
}

.nav-back-button-leave-to,
.nav-back-button-enter-from {
  margin-right: calc(var(--button-size-basis) * -1);

  opacity: 0;

  transform: translateX(-0.5rem);
}
</style>
