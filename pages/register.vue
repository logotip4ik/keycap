<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import type { OAuthProvider, SafeUser } from '~/types/server';

import { usernameRE } from '~/server/utils';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { oauthEnabled } = useRuntimeConfig().public;
const user = useUser();
const createToast = useToast();

const usernameComponent = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);
const emailComponent = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);
const passwordComponent = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);

const isLoading = ref(false);

const providers: Array<OAuthProvider> = ['GitHub', 'Google'];

watch(
  user,
  async (value) => value && await navigateTo(`/@${value.username}`),
  { immediate: true },
);

async function register() {
  const data = {
    username: usernameComponent.value?.$el.value,
    email: emailComponent.value?.$el.value,
    password: passwordComponent.value?.$el.value,
  };

  if (!data.username || !data.email || !data.password)
    return createToast('Fill all required fields');

  isLoading.value = true;

  preloadRouteComponents('/a');

  $fetch('/api/auth/register', { method: 'POST', body: data })
    .then((res) => res && (user.value = res.data))
    .catch((e) => createToast(e.statusMessage))
    .finally(() => isLoading.value = false);
}
</script>

<template>
  <NavSimple v-once />

  <main v-once class="register">
    <Form
      action="/api/auth/register"
      method="POST"
      @submit.prevent="register"
    >
      <FormHiddenValue
        id="browserAction"
        name="browserAction"
        type="checkbox"
        :value="true"
      />

      <FormTitle>
        We are going to create an account for you
      </FormTitle>

      <FormItem>
        <FormLabel target="username">
          Username
        </FormLabel>

        <FormInput
          id="username"
          ref="usernameComponent"
          type="text"
          name="username"
          placeholder="username (no spaces allowed)"
          autocomplete="username"
          minlength="3"
          :pattern="usernameRE.source"
          autofocus="true"
        />

        <FormInputNote>
          &nbsp;* this will be used as path to your notes
        </FormInputNote>
      </FormItem>

      <FormItem>
        <FormLabel target="email">
          Email
        </FormLabel>

        <FormInput
          id="email"
          ref="emailComponent"
          type="email"
          name="email"
          placeholder="email"
          autocomplete="email"
          minlength="5"
        />
      </FormItem>

      <FormItem>
        <FormLabel target="password">
          Password
        </FormLabel>

        <FormInput
          id="password"
          ref="passwordComponent"
          type="password"
          name="password"
          placeholder="password"
          autocomplete="new-password"
          minlength="8"
        />
      </FormItem>

      <FormItem actions>
        <FormInputNote>
          Have an account?
          <NuxtLink to="/login">
            Login
          </NuxtLink>
        </FormInputNote>

        <FormButton
          type="submit"
          :loading="isLoading"
        >
          Register
        </FormButton>

        <template v-if="oauthEnabled">
          <FormHr />

          <FormButtonSocial
            v-for="provider in providers"
            :key="provider"
            :provider="provider"
          >
            Continue with {{ provider }}
          </FormButtonSocial>
        </template>
      </FormItem>
    </form>
  </main>
</template>

<style src="~/assets/styles/auth-pages.scss"></style>
