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

    <WithBlob v-slot="attrs" top="55%">
      <Form v-bind="attrs" class="error-page__form" action="/" @submit.prevent="handleError">
        <FormTitle class="error-page__form__title">
          <span v-html="message" />
        </FormTitle>

        <FormItem class="error-page__form__actions" actions>
          <FormButton>
            Try to fix everything
          </FormButton>
        </FormItem>
      </Form>
    </WithBlob>
  </div>
</template>

<style lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100vh;
  height: 100svh;

  &__form {
    max-width: 650px;

    &__title {
      text-align: center;
    }

    &__actions {
      margin-top: 4rem !important;
    }
  }
}
</style>
