<script setup lang="ts">
import type { OAuthProvider } from '~/types/server';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const oauthEnabled = import.meta.config.oauthEnabled;

const createToast = useToaster();

const emailComp = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);

const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle');

const providers: Array<OAuthProvider> = ['GitHub', 'Google'];

async function register() {
  const data: Record<string, string> = {
    email: emailComp.value?.$el.value,
  };

  if (!data.email) {
    createToast('Fill all required fields');
    return;
  }

  state.value = 'loading';

  $fetch('/api/auth/register', { method: 'POST', body: data })
    .then(() => {
      state.value = 'success';
    })
    .catch((error) => {
      state.value = 'error';

      createToast(error.data.message || ERROR_MESSAGES.DEFAULT);
    });
}
</script>

<template>
  <NavSimple v-once />

  <main v-once class="register">
    <WithFadeTransition>
      <Form
        v-if="state !== 'success'"
        action="/api/auth/register"
        method="POST"
        @submit.prevent="register"
      >
        <FormHiddenValue
          id="browserAction"
          name="browserAction"
          value="true"
        />

        <FormTitle>
          We are going to create an account for you
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
            :loading="state === 'loading'"
          >
            Send an Email
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

      <div v-else class="success-container">
        <FormTitle>
          Check you inbox to continue onboarding
        </FormTitle>

        <p class="success-container__msg">
          Thanks for trust.
          <br>
          Will see you on other end
        </p>
      </div>
    </WithFadeTransition>
  </main>
</template>

<style src="~/assets/styles/auth-pages.scss" />

<style lang="scss">
.success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  text-align: center;

  padding-top: 2rem;
}
</style>
