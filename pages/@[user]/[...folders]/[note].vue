<script setup lang="ts">
import type { Note } from '@prisma/client';

const { params } = useRoute();
const notesCache = useNotesCache();
const { data: note, pending } = useLazyFetch<Note>(() => `/api/note/${params.note}`, {
  server: false,
  default: () => notesCache.get(params.id) || null,
  onResponse: ({ response }) => {
    if (!response._data?.id) return;

    notesCache.set(response._data.id, response._data as Note);
  },
});
</script>

<template>
  <div v-if="note">
    {{ note.name }}
    {{ note.content }}
  </div>
  <div v-else-if="pending">
    loading placeholder
  </div>
</template>
