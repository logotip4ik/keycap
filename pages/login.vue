<script setup lang="ts">
import type { SafeUser } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const user = useUser();
const createToast = useToast();

const emailInput = ref<HTMLInputElement | null>(null);
const passwordInput = ref<HTMLInputElement | null>(null);

const isLoading = ref(false);

async function login() {
  const data = {
    email: emailInput.value!.value,
    password: passwordInput.value!.value,
  };

  if (!data.email || !data.password)
    return createToast('Fill all required fields');

  isLoading.value = true;

  preloadRouteComponents('/@__preload_user_page__');

  $fetch<SafeUser | null>('/api/user/login', { method: 'POST', body: data })
    .then((newUser) => newUser && (user.value = newUser))
    .catch((e) => createToast(e.data.statusMessage))
    .finally(() => isLoading.value = false);
}

watch(user, async (value) => value && await navigateTo(`/@${value.username}`));
</script>

<template>
  <main class="login-page">
    <form
      action="/api/user/login"
      method="POST"
      class="login-page__form"
      @submit.prevent="login"
    >
      <input
        id="browserAction"
        name="browserAction"
        type="checkbox"
        checked
        class="login-page__form__hidden"
      >

      <p class="login-page__form__title font-wide">
        Let's sign you in
      </p>

      <div class="login-page__form__item">
        <input
          id="login-email"
          ref="emailInput"
          type="email"
          name="email"
          class="login-page__form__item__input"
          placeholder="email"
          autocomplete="email"
        >
      </div>

      <div class="login-page__form__item">
        <input
          id="login-password"
          ref="passwordInput"
          type="password"
          name="password"
          class="login-page__form__item__input"
          placeholder="password"
          autocomplete="current-password"
        >
      </div>

      <div class="login-page__form__item login-page__form__item--actions">
        <small class="login-page__form__item__note">
          Don't have an account?
          <NuxtLink to="/register">Register</NuxtLink>
        </small>

        <button
          type="submit"
          class="login-page__form__item__button"
          :class="{ 'login-page__form__item__button--loading': isLoading }"
        >
          Sign in
        </button>

        <hr class="login-page__form__hr">

        <a
          class="login-page__form__item__button login-page__form__item__button--oauth login-page__form__item__button--github"
          href="/api/oauth/github"
        >
          <svg width="98" height="96" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff" />
          </svg>

          Continue with GitHub
        </a>

        <a
          class="login-page__form__item__button login-page__form__item__button--oauth login-page__form__item__button--google"
          href="/api/oauth/google"
        >
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>

          Continue with Google
        </a>
      </div>
    </form>
  </main>
</template>

<style lang="scss">
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 100vh;

  padding: 2rem 1rem;

  &__form {
    width: 95%;
    max-width: 450px;

    padding: clamp(1rem, 2vw, 2rem);
    padding-top: min(12.5%, 9rem);

    border-radius: 0.25rem;

    &:focus-within {
      .login-page__form__item__label {
        opacity: 1;

        transition: opacity .1s;
      }
    }

    & > * + * {
      margin-top: 1.5rem;
    }

    &__hidden {
      display: none;
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
      z-index: 1;

      width: 100%;

      &--actions {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;

        text-align: center;

        margin-top: 3.5rem;
      }

      &__label {
        display: block;

        font-size: 0.95rem;
        font-weight: 500;

        opacity: 0.75;

        margin-bottom: 0.25rem;

        transition: opacity 0.3s;
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

      &__note {
        display: inline-block;

        position: absolute;
        bottom: calc(100% + 0.5rem);
        left: 50%;
        width: 100%;

        max-width: 33ch;

        opacity: 0.85;

        transform: translateX(-50%)
      }

      &__button {
        position: relative;
        z-index: 1;

        font: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--surface-color);
        text-decoration: none;
        white-space: nowrap;

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
          inset: 0;
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

        & + & {
          margin-top: 1rem;
        }

        &--oauth {
          // overwrites hover outline color
          --text-color: hsl(var(--base-color));

          display: flex;
          justify-content: center;
          align-items: center;

          padding-block: 0.75rem;

          color: var(--base-text-color, var(--text-color));
          background-color: hsl(var(--base-color));
          box-shadow: 0 0 1rem hsla(var(--base-color), 0.25);

          svg {
            --w: calc(1.45rem + 0.25vw);

            flex-shrink: 0;

            display: block;

            width: 100%;
            height: auto;

            max-width: var(--w);

            margin-right: calc(var(--w) / 2);
          }
        }

        &--github {
          --base-color: 215, 15%, 16%;
          --base-text-color: white;
        }

        &--google {
          --base-color: 240, 5%, 92%;
          --base-text-color: hsl(0, 0%, 7%);

          @media (prefers-color-scheme: light) {
            --base-color: 240, 5%, 97%;
          }
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

    &__hr {
      display: block;

      height: 1px;
      width: 92.5%;

      margin: 1.5rem auto;

      border: none;
      background-color: hsla(var(--text-color-hsl), 0.5);
      box-shadow: 0 0 0.5rem 0 hsla(var(--text-color-hsl), 0.125);
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
