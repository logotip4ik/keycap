<script setup lang="ts">
import type { NuxtError } from '#app';

interface Props {
  error: NuxtError
}

const props = defineProps<Props>();

const user = useUser();

const defaultMessage = 'Keycap has broken into pieces<br><small>I mean, something went completely wrong</small>';
const errorMessages: Record<number, string> = {
  404: 'There is no Esc, no Ctrl, no Space.<br><small>Just kidding.</small><br>Your page is not found thou...',
  401: 'God bless IBM model M<br>Btw, that route is not public',
};
const message = errorMessages[props.error.statusCode] || defaultMessage;

if (!import.meta.env.PROD)
  console.error(props.error);

function handleError() {
  clearError({
    redirect: user.value ? `/@${user.value.username}` : '/',
  });
}
</script>

<template>
  <div class="error-page">
    <NavSimple v-once />

    <p :aria-label="`${error.statusCode} error`" class="error-page__status-code">
      {{ error.statusCode }}
    </p>

    <Form class="error-page__form" action="/" @submit.prevent="handleError">
      <FormTitle class="error-page__form__title">
        <span v-html="message" />
      </FormTitle>

      <FormItem class="error-page__form__actions" actions>
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

    background: radial-gradient(92% 100% at 50.00% 115.00%, hsla(var(--selection-bg-color-hsl), 0.65) 0%, hsla(var(--selection-bg-color-hsl), 0.0) 110%);
    background-clip: text;

    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__form {
    max-width: 650px;

    &__title {
      text-align: center;
    }
  }
}
</style>
