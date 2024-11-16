<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});

const oauthEnabled = import.meta.config.oauthEnabled;

const user = useUser();
const createToast = useToaster();

const emailComp = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);
const passwordComp = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);

const isLoading = ref(false);

const providers: Array<OAuthProvider> = ['GitHub', 'Google'];

watch(user, async (user) => user && await navigateTo(`/@${user.username}`));

async function login() {
  const data = {
    email: emailComp.value?.$el.value,
    password: passwordComp.value?.$el.value,
  };

  if (!data.email || !data.password) {
    createToast('Fill all required fields.');
    return;
  }

  isLoading.value = true;

  preloadRouteComponents('/@a');

  $fetch('/api/auth/login', {
    method: 'POST',
    body: data,
    responseType: 'json',
    headers: { Accept: 'application/json' },
  })
    .then((res) => user.value = res.data)
    .catch((error) => createToast(error.data.message || ERROR_MESSAGES.DEFAULT))
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
          ref="emailComp"
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
          ref="passwordComp"
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
          Continue Keycaping
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

<style src="~/assets/styles/auth-pages.scss" />
