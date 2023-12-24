<script setup lang="ts">
const route = useRoute();

const { data: note, error } = await useAsyncData('share', async () => {
  // TODO: why res in unknown ?
  const res = await $fetch<{ data: SharedNote }>(`/api/share/${route.params.link}`);

  return res.data;
});

if (error.value || !note.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `nothing found with link: ${route.params.link}`,
  });
}

if (import.meta.server) {
  const { siteOrigin } = useRuntimeConfig().public;
  const protocol = import.meta.prod ? 'https' : 'http';

  useServerSeoMeta({
    title: makeTitle(note.value.name),

    ogTitle: makeTitle(note.value.name),
    ogDescription: `View "${note.value.name}" on Keycap`,
    ogUrl: `${protocol}://${siteOrigin}${route.path}`,

    twitterTitle: makeTitle(note.value.name),
    twitterDescription: `View "${note.value.name}" on Keycap`,
    twitterCard: 'summary_large_image',
    twitterCreator: '@bogdankostyuk_',
  });
}

function makeTitle(name: string) {
  return `Note "${name}" - Keycap`;
}
</script>

<template>
  <div v-if="note" v-once class="note-view">
    <NavSimple />

    <PagesViewHeader
      :note-name="note.name"
      :updated-at="note.updatedAt"
    />

    <main class="note-view__main">
      <NoteRenderer class="note-view__main__note-renderer" :content="note.content!" />
    </main>

    <PagesViewFooter />
  </div>
</template>

<style lang="scss">
.note-view {
  display: flex;
  flex-direction: column;
  position: relative;

  width: 91.25%;
  min-height: 100vh;
  min-height: 100svh;

  max-width: 1200px;

  padding: 25vh 0 0;
  margin: 0 auto;

  .nav {
    width: 100%;

    padding-left: 0;
    padding-right: 0;
  }

  &__header {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    margin-bottom: 10vh;

    &__alert {
      display: inline-block;

      color: hsla(var(--text-color-hsl), 0.8);

      margin: 0;
      padding: 0.5rem 0.75rem;

      border-radius: 0.25rem;
      border: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
      background-color: hsla(var(--selection-bg-color-hsl), 0.125);

      @media (prefers-color-scheme: dark) {
        background-color: hsla(var(--selection-bg-color-hsl), 0.25);
      }

      &__icon {
        margin-right: 0.25rem;

        vertical-align: baseline  !important;

        transform: translateY(1.5px);
      }
    }

    &__name {
      font-size: clamp(3.5rem, 4vw + 1.125rem, 5rem);
      line-height: 1.1;
      font-weight: 500;

      margin: 0;
      margin-bottom: 0.5rem;
    }

    &__updated-at {
      opacity: 0.75;
      margin: 0;
    }
  }
}
</style>
