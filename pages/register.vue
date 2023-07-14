<script setup lang="ts">
import type { OAuthProvider, SafeUser } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { oauthEnabled } = useRuntimeConfig().public;
const user = useUser();
const createToast = useToast();

const username = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

const isLoading = ref(false);

const providers: OAuthProvider[] = ['GitHub', 'Google'];

watch(user, async (value) =>
  value && await navigateTo(`/@${value.username}`),
);

async function register() {
  const data = {
    username: username.value,
    email: email.value,
    password: password.value,
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

function loadProviderIcon(provider: string) {
  return defineAsyncComponent(() =>
    import(`~/assets/svg/${provider.toLowerCase()}.svg?component`),
  );
}
</script>

<template>
  <main class="register">
    <Form
      action="/api/user/register"
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
        <FormInput
          id="username"
          type="text"
          name="username"
          placeholder="username (no spaces allowed)"
          autocomplete="username"
          minlength="3"
          pattern="[\w,.-]+?"
          :value="username"
          @update-value="username = $event"
        />

        <FormInputNote>
          &nbsp;* this will be used as path to your notes
        </FormInputNote>
      </FormItem>

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
          autocomplete="new-password"
          minlength="8"
          :value="password"
          @update-value="password = $event"
        />
      </FormItem>

      <FormItem actions>
        <FormButton type="submit" :loading="isLoading">
          Register
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
    </form>
  </main>
</template>

<style>
.register {
  padding-top: 15vh;
}
</style>
