<script setup lang="ts">
import type { Note } from '@prisma/client';

const route = useRoute();

const { data: note, error } = await useAsyncData<Pick<Note, 'name' | 'content' | 'updatedAt' | 'createdAt'>>(
  () => $fetch(`/api/share/${route.params.link}`),
);

useHead({
  title: note.value?.name,
  titleTemplate: '%s - Keycap',
});

function formatDate(date: string | Date) {
  date = new Date(date);

  return Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(date);
}

watch(error, (error) => {
  if (error) {
    showError({
      statusCode: 404,
      statusMessage: `nothing found with this link: ${route.params.link}`,
    });
  }
});
</script>

<template>
  <div v-if="note" class="note-view">
    <header class="note-view__header">
      <p class="note-view__header__name">
        {{ note.name }}
      </p>
      <p class="note-view__header__updated-at">
        Last update at: {{ formatDate(note.updatedAt) }}
      </p>
    </header>

    <!-- TODO: render content with Client only component, similar to note editor -->
    <main class="note-view__main">
      <NoteRendered class="note-view__main__note-renderer" :content="note.content!" />
    </main>
  </div>
</template>

<style lang="scss">
.note-view {
  width: 95%;
  height: 100%;

  max-width: 1200px;

  padding: 25vh 0 0;
  margin: 0 auto;

  &__header {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    margin-bottom: 10vh;

    &__name {
      font-size: clamp(3.5rem, 4vw + 1rem, 5rem);
      font-weight: 500;

      margin: 0 0 0.5rem;
    }

    &__updated-at {
      opacity: 0.75;
      margin: 0;
    }
  }

  &__main {
    &__note-renderer {
      .ProseMirror {
        padding-top: 0;
        padding-inline: 0;
      }
    }
  }
}
</style>
