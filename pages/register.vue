<script setup lang="ts">
import type { SafeUser } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const user = useUser();
const createToast = useToast();

const usernameInput = ref<HTMLInputElement | null>(null);
const emailInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);

const isLoading = ref(false);

async function register() {
  const data = {
    username: usernameInput.value!.value,
    email: emailInput.value!.value,
    password: passwordInput.value!.value,
  };

  if (!data.username || !data.email || !data.password)
    return createToast('Fill all required fields');

  isLoading.value = true;

  preloadRouteComponents('/@__preload_user_page__');

  $fetch<SafeUser | null>('/api/user/register', { method: 'POST', body: data })
    .then((newUser) => newUser && (user.value = newUser))
    .catch((e) => createToast(e.statusMessage))
    .finally(() => isLoading.value = false);
}

watch(user, async (value) => value && await navigateTo(`/@${value.username}`));
</script>

<template>
  <main class="register-page">
    <LazyWorkspaceToasts />

    <form class="register-page__form" @submit.prevent="register">
      <p class="register-page__form__title font-wide">
        We are going to create an account for you
      </p>

      <div class="register-page__form__item">
        <input
          id="register:username"
          ref="usernameInput"
          type="text"
          name="username"
          class="register-page__form__item__input"
          placeholder="username, no spaces allowed"
          autocomplete="username"
        >

        <small class="register-page__form__item__note">
          &nbsp; * this will be used as path to your notes
        </small>
      </div>

      <div class="register-page__form__item">
        <input
          id="register:email"
          ref="emailInput"
          type="email"
          name="email"
          class="register-page__form__item__input"
          placeholder="email"
          autocomplete="email"
        >
      </div>

      <div class="register-page__form__item">
        <input
          id="register:password"
          ref="passwordInput"
          type="password"
          name="password"
          class="register-page__form__item__input"
          placeholder="password"
          autocomplete="new-password"
        >
      </div>

      <div class="register-page__form__item register-page__form__item--actions">
        <button
          type="submit"
          class="register-page__form__item__submit-button"
          :disabled="isLoading"
          :class="{ 'register-page__form__item__submit-button--loading': isLoading }"
        >
          register
        </button>
      </div>
    </form>
  </main>
</template>

<style lang="scss">
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;

  padding: 2rem 1rem;

  &__form {
    width: 95%;
    max-width: 450px;

    padding: clamp(1rem, 2vw, 2rem);

    border-radius: 0.25rem;

    &:focus-within {
      .register-page__form__item__label {
        opacity: 1;

        transition: opacity .1s;
      }
    }

    & > * + * {
      margin-top: 2rem;
    }

    &__title {
      font-size: 2rem;
      font-weight: 500;
      text-align: left;

      padding-top: 1rem;
      margin: 0 0 2.5rem 0;
    }

    &__item {
      position: relative;

      width: 100%;

      &--actions {
        text-align: center;

        margin-top: 3rem;
      }

      &__label {
        display: block;

        font-size: 0.95rem;
        font-weight: 500;

        opacity: 0.75;

        margin-bottom: 0.25rem;

        transition: opacity 0.3s;
      }

      &__note {
        display: inline-block;

        position: absolute;
        top: calc(100% + 0.25rem);
        left: 0.25rem;
        width: 100%;

        max-width: 33ch;

        opacity: 0.6;
      }

      &__input {
        font: inherit;
        font-size: 1rem;
        line-height: 1.75;
        color: currentColor;

        width: 100%;

        padding: 0.75rem 0.75rem;

        appearance: none;
        border-radius: 0.5rem;
        border: 1px solid rgba($color: grey, $alpha: 0.5);
        background-color: transparent;

        transition: border-color 0.3s;

        &:is(:focus-visible, :hover) {
          outline: none;

          border-color: grey;

          transition: border-color 0.1s;
        }
      }

      &__submit-button {
        position: relative;
        z-index: 1;

        font: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--surface-color);

        width: 90%;
        max-width: 330px;

        padding: 1rem 2rem;

        border: none;
        border-radius: 0.5rem;
        outline: 1px solid transparent;
        outline-offset: -1px;
        background-color: var(--text-color);

        cursor: pointer;
        transition: outline .3s, outline-offset .3s;

        &:focus {
          outline-style: solid;
        }

        &:is(:hover, :focus-visible) {
          outline-color: var(--text-color);
          outline-offset: 0.3rem;

          transition: outline-color 0.1s, outline-offset 0s;
        }

        &::after,
        &::before {
          content: '';

          position: absolute;

          opacity: 0;
          transition: opacity .2s;
        }

        &::after {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;

          border-radius: inherit;
          background-color: hsla(var(--text-color-hsl), 0.95);

          @supports (backdrop-filter: blur(1px)) {
            backdrop-filter: blur(2px);
            background-color: hsla(var(--text-color-hsl), 0.5);
          }
        }

        &::before {
          --size: 1.5rem;

          top: calc(50% - var(--size) / 2);
          left: calc(50% - var(--size) / 2);
          z-index: 2;

          width: var(--size);
          height: var(--size);

          border-radius: 50%;
          border: 2px solid transparent;
          border-left-color: var(--surface-color);

          animation: spin 1s infinite linear;
        }

        &--loading {
          &::after,
          &::before {
            opacity: 1;
          }

          outline-offset: -1px !important;
          pointer-events: none;
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
