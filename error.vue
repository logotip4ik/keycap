<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError
}>();

const user = useUser();

const notes = [
  'Keycap has broken into pieces.',
  'There is no Esc, no Ctrl, no Space.',
  'God bless IBM model M.',
];

const randomNote = notes[Math.floor(Math.random() * notes.length)];

const errorMessages: Record<number, string> = {
  404: 'Your page is not found thou...',
  401: 'Btw, that route is not public',
  500: 'I mean, something went completely wrong',
};

const message = errorMessages[props.error.statusCode] || 'That was unexpected (⊙_⊙;)';

useSeoMeta({
  title: () => `Keycap - ${props.error.statusCode}`,
  ogTitle: () => `Keycap - ${props.error.statusCode}`,

  description: () => `${randomNote} ${message}`,
  ogDescription: () => `${randomNote} ${message}`,
});

function handleError() {
  clearError({
    redirect: user.value ? `/@${user.value.username}` : '/',
  });
}

onMounted(() => {
  requestIdleCallback(() => {
    if (props.error.statusCode === 404) {
      return;
    }

    sendError(props.error);
  });
});
</script>

<template>
  <div class="error-page">
    <NavSimple v-once />

    <p :aria-label="`${error.statusCode} error`" class="error-page__status-code">
      {{ error.statusCode }}
    </p>

    <Form class="error-page__form" action="/" @submit.prevent="handleError">
      <FormTitle class="error-page__form__title">
        <small v-html="randomNote" />
        <br>
        <span v-html="message" />
      </FormTitle>

      <FormItem actions>
        <FormButton>
          Try to fix everything
        </FormButton>
      </FormItem>
    </Form>
  </div>
</template>

<style lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100vh;
  height: 100svh;

  &__status-code {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;

    font-variant-numeric: tabular-nums;
    font-size: min(calc(2rem + 45vw), 30rem);
    font-weight: 800;
    color: transparent;

    margin: 0;

    background: radial-gradient(
      92% 100% at 50.00% 115.00%,
      hsla(var(--selection-bg-color-hsl), 0.65) 0%,
      hsla(var(--selection-bg-color-hsl), 0.0) 110%
    );
    background-clip: text;

    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__form {
    max-width: 650px;

    &__title {
      text-align: center;

      small {
        font-weight: 400;
        color: hsla(var(--text-color-hsl), 0.75);
        line-height: 1.25;
      }
    }
  }
}
</style>
