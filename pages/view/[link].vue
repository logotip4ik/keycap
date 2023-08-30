<script setup lang="ts">
import { getRequestURL } from 'h3';

import type { Note } from '@prisma/client';

const route = useRoute();

type SharedNote = Pick<Note, 'name' | 'content' | 'updatedAt' | 'createdAt'>;

const { data: note, error } = await useAsyncData(
  async () => await $fetch<SharedNote>(`/api/share/${route.params.link}`),
);

if (error.value || !note.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `nothing found with link: ${route.params.link}`,
  });
}

if (import.meta.env.SSR) {
  const url = getRequestURL(useRequestEvent());

  useSeoMeta({
    titleTemplate: '%s - Keycap',
    title: note.value.name,
    ogTitle: note.value.name,
    ogDescription: `View contents of '${note.value.name}'`,
    ogUrl: url.toString(),
  }, { mode: 'server' });
}

function formatDate(date: string | Date) {
  date = new Date(date);

  return Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(date);
}
</script>

<template>
  <div v-if="note" v-once class="note-view">
    <NavSimple />

    <header class="note-view__header">
      <p class="note-view__header__name">
        {{ note.name }}
      </p>

      <p class="note-view__header__updated-at">
        Last update at: {{ formatDate(note.updatedAt) }}
      </p>
    </header>

    <main class="note-view__main">
      <NoteRenderer class="note-view__main__note-renderer" :content="note.content!" />
    </main>
  </div>
</template>

<style lang="scss">
.note-view {
  position: relative;
  isolation: isolate;

  width: 91.25%;
  height: 100%;

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
