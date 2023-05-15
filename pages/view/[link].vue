<script setup lang="ts">
import type { Note } from '@prisma/client';

const route = useRoute();

const { data: note, error } = await useAsyncData<Pick<Note, 'name' | 'content' | 'updatedAt' | 'createdAt'>>(
  async () => await $fetch(`/api/share/${route.params.link}`),
);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `nothing found with link: ${route.params.link}`,
  });
}

useHead({
  title: note.value?.name,
  titleTemplate: '%s - Keycap',
});

const isNoteContentsEmpty = (note.value?.content?.replace(/<[^>]+>/g, '').trim() || '') === '';

function formatDate(date: string | Date) {
  date = new Date(date);

  return Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(date);
}
</script>

<template>
  <div v-if="note" class="note-view">
    <nav class="note-view__nav">
      <NuxtLink class="note-view__nav__title font-wide" to="/">
        <img
          src="/favicon-32x32.png"
          alt="purple keycap"
          class="note-view__nav__title__img"
          fetchpriority="high"
          decoding="async"
          width="32"
          height="32"
        >
        Keycap
      </NuxtLink>
    </nav>

    <header class="note-view__header">
      <small v-if="isNoteContentsEmpty" class="note-view__header__alert">
        <Icon name="ic:outline-info" class="note-view__header__alert__icon" />
        Note is empty
      </small>

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

  width: 95%;
  height: 100%;

  max-width: 1200px;

  padding: 25vh 0 0;
  margin: 0 auto;

  &__nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    position: absolute;
    left: 0;
    right: 0;
    top: calc(3vh + 1vw);

    width: 100%;

    &__title {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      font-size: 1.25rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--text-color);

      margin: 0;

      opacity: 0.8;

      transition: opacity .3s, filter .3s;

      &__img {
        display: block;

        width: 2rem;
        height: auto;

        margin-right: 0.5rem;
        margin-bottom: 0.125rem;
      }

      &:is(:hover, :focus-visible) {
        transition-duration: .1s;

        opacity: 1;
        filter: drop-shadow(0px 0px 0.5rem hsla(var(--text-color-hsl), 0.175));
      }
    }
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
      line-height: 1.25;
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
