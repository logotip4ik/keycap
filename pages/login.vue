<script setup lang="ts">
import type { OAuthProvider, SafeUser } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { oauthEnabled } = useRuntimeConfig().public;
const user = useUser();
const createToast = useToast();

const email = ref<string>('');
const password = ref<string>('');

const isLoading = ref(false);

const providers: OAuthProvider[] = ['GitHub', 'Google'];

watch(user, async (value) =>
  value && await navigateTo(`/@${value.username}`),
);

async function login() {
  const data = {
    // TODO: check if firefox autocomplete still works
    email: email.value,
    password: password.value,
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

function loadProviderIcon(provider: string) {
  return defineAsyncComponent(() =>
    import(`~/assets/svg/${provider.toLowerCase()}.svg?component`),
  );
}
</script>

<template>
  <main class="login">
    <Form
      action="/api/user/login"
      method="POST"
      @submit.prevent="login"
    >
      <FormHiddenValue
        id="browserAction"
        name="browserAction"
        type="checkbox"
        :value="true"
      />

      <FormTitle>
        Let's sign you in
      </FormTitle>

      <FormItem>
        <FormInput
          id="email"
          type="email"
          name="email"
          placeholder="email"
          autocomplete="email"
          minlength="5"
          :value="email"
          @update-value="email = $event"
        />
      </FormItem>

      <FormItem>
        <FormInput
          id="password"
          type="password"
          name="password"
          placeholder="password"
          autocomplete="current-password"
          minlength="8"
          :value="password"
          @update-value="password = $event"
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
            <component :is="loadProviderIcon(provider)" />

            Continue with {{ provider }}
          </FormButtonSocial>
        </template>
      </FormItem>
    </Form>
  </main>
</template>

<style>
.login {
  padding-top: 22.5vh;
}
</style>
