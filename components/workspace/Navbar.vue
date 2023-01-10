<script setup lang="ts">
import { blankNoteName } from '~/assets/constants';
import breakpoints from '~/assets/constants/breakpoints';

const router = useRouter();
const route = useRoute();
const user = useUser();
const device = useDevice();
const currentNoteState = useCurrentNoteState();

const canShowBackButton = ref(false);
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

const headingAttrs = computed(() => {
  if (!currentNoteState.value) return {};

  return { [`note-${currentNoteState.value}`]: '' };
});

function showFolderContents() {
  router.push({ ...route, params: { ...route.params, note: blankNoteName } });
}

watch(() => route.path, () => {
  const isServerSide = process.server;

  if (!user.value)
    return canShowBackButton.value = false;

  if (isServerSide)
    return canShowBackButton.value = device.isMobileOrTablet;

  if (window.innerWidth > breakpoints.tablet)
    return canShowBackButton.value = false;

  if (!route.params.note || route.params.note === blankNoteName)
    return canShowBackButton.value = false;

  canShowBackButton.value = true;
}, { immediate: true });

watch(() => route.params.note, (noteName) => {
  const isEmptyNoteName = !noteName || noteName === blankNoteName;

  if (isEmptyNoteName) currentNoteState.value = '';
});
</script>

<template>
  <nav class="nav">
    <Transition name="nav-back-button">
      <button
        v-show="canShowBackButton && (route.params.note && route.params.note !== blankNoteName)"
        class="nav__back-button"
        @click="showFolderContents"
      >
        <Icon name="ic:baseline-arrow-back" class="nav__back-button__icon" />
      </button>
    </Transition>

    <p class="nav__heading" v-bind="headingAttrs">
      {{ headingText }}
    </p>
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    position: relative;
    z-index: 1;

    font-size: 1.1rem;

    // NOTE: hide not needed text but show saved indicator
    clip-path: inset(-100% 0 0 -100%);

    &::after {
      --indicator-size: 0.5rem;

      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: var(--indicator-size);
      height: var(--indicator-size);

      border-radius: 50%;
      background-color: transparent;
      box-shadow: 0 0 1rem 0 transparent;

      transform: translate(-100%, -50%);

      transition:background-color 1s ease, box-shadow 1s ease;
    }

    &[note-fetching]::after,
    &[note-updating]::after {
      background-color: goldenrod;
      box-shadow: 0 0 1rem 0 rgba($color: goldenrod, $alpha: 0.75);
    }

    &[note-saved]::after {
      background-color: limegreen;
      box-shadow: 0 0 1rem 0 rgba($color: limegreen, $alpha: 0.75);
    }
  }

  &__back-button {
    --button-size-basis: 2.5rem;

    display: none;

    color: hsla(var(--text-color-hsl), 0.85);

    width: var(--button-size-basis);
    height: var(--button-size-basis);

    margin-right: 1rem;

    appearance: none;
    border: none;
    border-radius: 0.2rem;
    background-color: hsla(var(--text-color-hsl), 0.1);

    cursor: pointer;
    transition: color .3s, background-color .3s;

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
