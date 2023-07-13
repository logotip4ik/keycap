<script setup lang="ts">
import GithubIcon from '~/assets/svg/github.svg';
import GoogleIcon from '~/assets/svg/google.svg';

import type { SafeUser } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { oauthEnabled } = useRuntimeConfig().public;
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
  <main class="auth-page">
    <form
      action="/api/user/login"
      method="POST"
      class="auth-page__form"
      @submit.prevent="login"
    >
      <input
        id="browserAction"
        name="browserAction"
        type="checkbox"
        checked
        class="auth-page__form__hidden"
      >

      <p class="auth-page__form__title font-wide">
        Let's sign you in
      </p>

      <div class="auth-page__form__item">
        <input
          id="login-email"
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
          id="login-password"
          ref="passwordInput"
          type="password"
          name="password"
          class="auth-page__form__item__input"
          placeholder="password"
          autocomplete="current-password"
        >
      </div>

      <div class="auth-page__form__item auth-page__form__item--actions">
        <small class="auth-page__form__item__note">
          Don't have an account?
          <NuxtLink to="/register">Register</NuxtLink>
        </small>

        <button
          type="submit"
          class="auth-page__form__item__button"
          :class="{ 'auth-page__form__item__button--loading': isLoading }"
        >
          Sign in
        </button>

        <template v-if="oauthEnabled">
          <hr class="auth-page__form__hr">

          <a
            class="auth-page__form__item__button auth-page__form__item__button--oauth auth-page__form__item__button--github"
            href="/api/oauth/github"
          >
            <GithubIcon />

            Continue with GitHub
          </a>

          <a
            class="auth-page__form__item__button auth-page__form__item__button--oauth auth-page__form__item__button--google"
            href="/api/oauth/google"
          >
            <GoogleIcon />

            Continue with Google
          </a>
        </template>
      </div>
    </form>
  </main>
</template>

<style src="~/assets/styles/auth-page.scss"></style>
