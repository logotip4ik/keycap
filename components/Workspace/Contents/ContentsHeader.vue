<script setup lang="ts">
defineProps<{
  state: SidebarState
  onUpdateState: (newState: SidebarState) => void
}>();

const route = useRoute();

interface Crumb { name: string, href: string }
const crumbs = computed(() => {
  const folders = (
    Array.isArray(route.params.folders)
      ? route.params.folders
      : [route.params.folders]
  )
    .filter(Boolean);

  const crumbs: Array<Crumb> = [{
    name: folders.length === 0 ? 'Workspace' : 'WS',
    href: `/@${route.params.user}`,
  }];

  for (let i = 0; i < folders.length; i++) {
    const base = crumbs[i].href.replace(`/${BLANK_NOTE_NAME}`, '');

    crumbs.push({
      name: folders[i],
      href: `${base}/${encodeURIComponent(folders[i])}/${BLANK_NOTE_NAME}`,
    });
  }

  return crumbs;
});
</script>

<template>
  <header class="contents__header">
    <TransitionGroup
      tag="div"
      class="contents__header__name"
      name="list"
    >
      <p
        v-for="(crumb, i) in crumbs"
        :key="crumb.name + crumb.href"
        class="contents__header__name__crumb"
      >
        <LazyIconRoundChevronRight
          v-if="i"
          class="contents__header__name__crumb__icon"
        />

        <NuxtLink
          :href="crumb.href"
          class="contents__header__name__crumb__link"
        >
          {{ crumb.name }}
        </NuxtLink>
      </p>
    </TransitionGroup>

    <button
      data-open-button
      class="contents__header__open-btn"
      :class="{ 'contents__header__open-btn--exposed': state === 'hidden' }"
      :aria-pressed="state === 'pinned'"
      @click="onUpdateState(state === 'pinned' ? 'hidden' : 'pinned')"
      @mouseenter="state === 'hidden' && onUpdateState('visible')"
    >
      <LazyIconOutlineFolder class="contents__header__open-btn__icon" />
    </button>
  </header>
</template>

<style lang="scss">
.contents__header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__name {
    --scrollbar-thumb-color: hsla(var(--text-color-hsl), 0.175);
    --scrollbar-background: var(--surface-color);

    display: flex;
    justify-content: flex-start;
    align-items: center;

    font-size: calc(1rem + 0.25vw);
    font-stretch: 105%;
    color: hsla(var(--text-color-hsl), 0.825);
    text-overflow: ellipsis;
    white-space: nowrap;

    height: 100%;

    padding: 0;
    margin-right: calc(var(--pd-x) / 2);

    // idk how, but chrome was adding y scroll at certain screen width
    overflow: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-background);
    &::-webkit-scrollbar {
      height: 0.25rem;

      background: var(--scrollbar-background);
    }

    &::-webkit-scrollbar-thumb {
      height: 0.25rem;

      background-color: var(--scrollbar-thumb-color);
    }

    &__crumb {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      margin: 0;

      scroll-snap-align: start;

      &__link {
        color: hsla(var(--text-color-hsl), 0.825);

        transition: color .3s;

        @media (hover: hover) {
          color: hsla(var(--text-color-hsl), 0.75);
        }

        &:is(:hover, :focus-visible) {
          color: var(--text-color);

          &:focus-visible {
            border-radius: 0.125rem;
            outline: 2px solid hsla(var(--selection-bg-color-hsl), 0.75);
          }

          transition-duration: 0.1s;
        }

        text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
        text-underline-offset: 3px;
      }

      &__icon {
        --size: max(3vw, 1.5rem);

        width: var(--size);
        height: auto;

        max-width: 2rem;

        margin: 0 -0.25ch;

        color: hsla(var(--text-color-hsl), 0.2)
      }
    }
  }

  &__open-btn {
    --size: min(5vw, 2.75rem);

    flex-shrink: 0;

    width: var(--size);
    height: var(--size);

    appearance: none;
    border: none;
    border-radius: 0.25rem;
    outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
    background-color: hsla(var(--surface-color-hsl), 0.95);

    cursor: pointer;
    will-change: transform;
    transition: transform var(--sidebar-tr-duration) var(--sidebar-tr-ease);

    @supports (backdrop-filter: blur(1px)) {
      background-color: transparent;

      backdrop-filter: blur(12px);
    }

    @media (width <= $breakpoint-tablet) {
      --size: min(12.5vw, 3rem);
    }

    &:is(:hover, :focus-visible) {
      outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);

      &:focus-visible {
        background-color: hsla(var(--selection-bg-color-hsl), 0.25);
      }

      svg {
        color: hsla(var(--text-color-hsl), 0.65);

        transition-duration: .1s;
      }
    }

    &[aria-pressed="true"] {
      outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.75);
      box-shadow: 0 0 0.5rem 0 hsla(var(--selection-bg-color-hsl), 0.25);

      svg {
        color: hsla(var(--text-color-hsl), 0.8);

        transition-duration: .1s;
      }
    }

    &--exposed {
      transform: translate3d(calc(var(--dir) * var(--sidebar-width) - 1px), 1px, 0) scale3d(calc(2 - var(--sidebar-hidden-scale)), calc(2 - var(--sidebar-hidden-scale)), 1);
    }

    &__icon {
      color: hsla(var(--text-color-hsl), 0.5);

      width: 62.5%;
      height: auto;

      transition: color var(--sidebar-tr-duration) ease;
    }
  }
}
</style>
