<script setup lang="ts">
const route = useRoute();
const { site } = useRuntimeConfig().public;

const { data: note, error } = await useAsyncData('share', async () => {
  const fetch = useRequestFetch();

  // TODO: why res in unknown ?
  const res = await fetch<{ data: SharedNote }>(`/api/share/${route.params.link}`, {
    responseType: 'json',
    headers: protectionHeaders,
  });

  return res.data;
}, {
  pick: ['name', 'updatedAt'],
});

if (error.value || !note.value) {
  throw createError({
    status: 404,
    message: `nothing found with link: ${route.params.link}`,
  });
}

useSeoMeta({
  title: `View on Keycap - ${note.value.name}`,

  ogTitle: `View on Keycap - ${note.value.name}`,
  ogImage: `${defaultProtocol}${site}/og${route.path}`,
  ogType: 'article',

  twitterCard: 'summary_large_image',
  twitterImage: `${defaultProtocol}${site}/og${route.path}`,
  twitterImageAlt: `${note.value.name} - Keycap`,
});
</script>

<template>
  <div v-if="note" v-once class="note-view">
    <NavSimple />

    <PagesViewHeader
      :note-name="note.name"
      :updated-at="note.updatedAt"
    />

    <main class="note-view__main">
      <NoteRenderer
        class="note-view__main__note-renderer"
        :shared-link="route.params.link"
      />
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

  padding: 30vh 0 0;
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

        vertical-align: baseline !important;

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
