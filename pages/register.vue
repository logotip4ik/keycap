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
      </div>
    </form>
  </main>
</template>

<style src="~/assets/styles/auth-page.scss"></style>
