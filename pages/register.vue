<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import type { OAuthProvider, SafeUser } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { oauthEnabled } = useRuntimeConfig().public;
const user = useUser();
const createToast = useToast();

const usernameComponent = ref<ComponentPublicInstance<HTMLInputElement> | null>(null);
const emailComponent = ref<ComponentPublicInstance<HTMLInputElement> | null>(null);
const passwordComponent = ref<ComponentPublicInstance<HTMLInputElement> | null>(null);

const isLoading = ref(false);

const providers: OAuthProvider[] = ['GitHub', 'Google'];

watch(user, async (value) =>
  value && await navigateTo(`/@${value.username}`),
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
          ref="usernameComponent"
          type="text"
          name="username"
          placeholder="username (no spaces allowed)"
          autocomplete="username"
          minlength="3"
          pattern="[\w,.-]+?"
        />

        <FormInputNote>
          &nbsp;* this will be used as path to your notes
        </FormInputNote>
      </FormItem>

      <FormItem>
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
