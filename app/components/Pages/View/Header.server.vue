<script setup lang="ts">
defineProps<{
  noteName: string
  updatedAt: string | Date
}>();

function formatDate(date: string | Date) {
  date = new Date(date);

  return Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(date);
}
</script>

<template>
  <header class="note-view__header">
    <p class="note-view__header__name">
      {{ noteName }}
    </p>

    <p class="note-view__header__updated-at">
      Last update at: {{ formatDate(updatedAt) }}
    </p>
  </header>
</template>
