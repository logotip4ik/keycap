<script setup lang="ts">
const route = useRoute();

interface Crumb { name: string, href: string }
const crumbs = computed(() => {
  const folders = !route.params.folders ? [] : route.params.folders as Array<string>;

  const crumbs: Array<Crumb> = [{
    name: folders.length === 0 ? 'Workspace' : 'WS',
    href: `/@${route.params.user}`,
  }];

  for (let i = 0; i < folders.length; i++) {
    crumbs.push({
      name: folders[i],
      href: `${crumbs[i].href}/${encodeURIComponent(folders[i])}`,
    });
  }

  return crumbs;
});

const crumbsAriaLabel = computed(() => {
  return `Current folder: ${crumbs.value.map((crumb) => crumb.name).join('/')}`;
});
</script>

<template>
  <WithListTransitionGroup
    id="contents-header"
    class="contents__header__name"
    :aria-label="crumbsAriaLabel"
  >
    <p
      v-for="(crumb, i) in crumbs"
      :key="crumb.name + crumb.href"
      class="contents__header__name__crumb"
      style="margin: 0;"
    >
      <Icon
        v-if="i"
        name="round-chevron-right"
        class="contents__header__name__crumb__icon"
      />

      <NuxtLink
        :href="`${crumb.href}/${BLANK_NOTE_NAME}`"
        class="contents__header__name__crumb__link"
      >
        {{ crumb.name }}
      </NuxtLink>
    </p>
  </WithListTransitionGroup>
</template>

<style lang="scss">
.contents__header__name {
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
  scroll-snap-type: x mandatory; // proximity behaves really weirdly in chrome
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

    scroll-snap-align: start;

    &__link {
      color: hsla(var(--text-color-hsl), 0.825);

      transition: color .3s;

      text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
      text-underline-offset: 3px;

      @media (hover: hover) {
        color: hsla(var(--text-color-hsl), 0.75);
      }

      &:is(:hover, :focus-visible) {
        color: var(--text-color);

        transition-duration: 0.1s;

        &:focus-visible {
          border-radius: 0.125rem;
          outline: 2px solid hsla(var(--selection-bg-color-hsl), 0.75);
        }
      }
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
</style>
