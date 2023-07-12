<script setup lang="ts">
import type { SafeUser } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { oauthEnabled } = useRuntimeConfig().public;
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
    .catch((e) => createToast(e.data.statusMessage))
    .finally(() => isLoading.value = false);
}

watch(user, async (value) => value && await navigateTo(`/@${value.username}`));
</script>

<template>
  <main class="auth-page">
    <form
      action="/api/user/register"
      method="POST"
      class="auth-page__form"
      @submit.prevent="register"
    >
      <input
        id="browserAction"
        name="browserAction"
        type="checkbox"
        checked
        class="auth-page__form__hidden"
      >

      <p class="auth-page__form__title font-wide">
        We are going to create an account for you
      </p>

      <div class="auth-page__form__item">
        <input
          id="register-username"
          ref="usernameInput"
          type="text"
          name="username"
          class="auth-page__form__item__input"
          placeholder="username, no spaces allowed"
          autocomplete="username"
        >

        <small class="auth-page__form__item__note auth-page__form__item__note--bottom">
          &nbsp; * this will be used as path to your notes
        </small>
      </div>

      <div class="auth-page__form__item">
        <input
          id="register-email"
          ref="emailInput"
          type="email"
          name="email"
          class="auth-page__form__item__input"
          placeholder="email"
          autocomplete="email"
        >
      </div>

      <div class="auth-page__form__item">
        <input
          id="register-password"
          ref="passwordInput"
          type="password"
          name="password"
          class="auth-page__form__item__input"
          placeholder="password"
          autocomplete="new-password"
        >
      </div>

      <div class="auth-page__form__item auth-page__form__item--actions">
        <button
          type="submit"
          class="auth-page__form__item__button"
          :disabled="isLoading"
          :class="{ 'auth-page__form__item__button--loading': isLoading }"
        >
          register
        </button>

        <template v-if="oauthEnabled">
          <hr class="auth-page__form__hr">

          <a
            class="auth-page__form__item__button auth-page__form__item__button--oauth auth-page__form__item__button--github"
            href="/api/oauth/github"
          >
            <svg width="98" height="96" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff" />
            </svg>

            Continue with GitHub
          </a>

          <a
            class="auth-page__form__item__button auth-page__form__item__button--oauth auth-page__form__item__button--google"
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
        </template>
      </div>
    </form>
  </main>
</template>

<style src="~/assets/styles/auth-page.scss"></style>
