<script setup lang="ts">
import type { OAuthProvider } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { oauthEnabled } = useRuntimeConfig().public;
const user = useUser();
const createToast = useToaster();

const emailComponent = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);
const passwordComponent = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);

const isLoading = ref(false);

const providers: Array<OAuthProvider> = ['GitHub', 'Google'];

watch(
  user,
  async (value) => value && await navigateTo(`/@${value.username}`),
  { immediate: true },
);

async function login() {
  const data = {
    email: emailComponent.value?.$el.value,
    password: passwordComponent.value?.$el.value,
  };

  if (!data.email || !data.password)
    return createToast('Fill all required fields');

  isLoading.value = true;

  preloadRouteComponents('/@a');

  $fetch('/api/auth/login', { method: 'POST', body: data })
    .then((res) => res && (user.value = res.data))
    .catch((e) => { createToast(e.statusMessage || e.data.statusMessage); }) // NOTE: statusMessage is not defined in vercel env
    .finally(() => isLoading.value = false);
}
</script>

<template>
  <NavSimple v-once />

  <main v-once class="login">
    <Form
      action="/api/auth/login"
      method="POST"
      @submit.prevent="login"
    >
      <FormHiddenValue
        id="browserAction"
        name="browserAction"
        :value="true"
      />

      <FormTitle>
        Let's sign you in
      </FormTitle>

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
          autofocus="true"
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
          autocomplete="current-password"
          minlength="8"
        />
      </FormItem>

      <FormItem actions>
        <FormInputNote>
          Don't have an account?
          <NuxtLink to="/register">
            Register
          </NuxtLink>
        </FormInputNote>

        <FormButton
          type="submit"
          :loading="isLoading"
        >
          Sign in
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
    </Form>
  </main>
</template>

<style src="~/assets/styles/auth-pages.scss"></style>
