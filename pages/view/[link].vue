<script setup lang="ts">
import type { Note } from '@prisma/client';

const route = useRoute();

const { data: note, error } = await useAsyncData<Pick<Note, 'name' | 'content' | 'updatedAt' | 'createdAt'>>(
  () => $fetch(`/api/share/${route.params.link}`),
);

// TODO: export note editor styles to separate file and include here
// TODO: create client only component similar to NoteEditor but smaller in size and readonly state

useHead({
  title: note.value?.name,
  titleTemplate: '%s - Keycap',
});

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
  <div v-if="note">
    <header>
      <!-- TODO: style as h1 -->
      <p>
        {{ note.name }}
      </p>
      <p>{{ note.updatedAt }}</p>
    </header>

    <!-- TODO: render content with Client only component, similar to note editor
    {{ note.content }} -->
    <!-- TODO: remove v-html -->
    <main v-html="note.content" />
  </div>
</template>
