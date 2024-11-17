<script setup lang="ts">
definePageMeta({
  middleware: ['redirect-dashboard'],
});

const oauthEnabled = import.meta.config.oauthEnabled;

const router = useRouter();
const createToast = useToaster();
const user = useUser();

const emailComp = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);
const usernameComp = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);
const passwordComp = shallowRef<ComponentPublicInstance<HTMLInputElement> | null>(null);

const email = useState<string | undefined>();

if (import.meta.server) {
  const event = useRequestEvent()!;
  const query = event.path.split('?')[1];

  if (query.includes('code=')) {
    email.value = await useRequestFetch()(`/api/auth/code-info?${query}`, {
      responseType: 'json',
    })
      .catch(async (error) => {
        await sendError(error, { msg: 'maybe verifcation code expired' });
      }) || undefined;
  }
}

const emailVerified = email.value != null;
const verificationCode = useRequestURL().searchParams.get('code') || undefined;

const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle');

const providers: Array<OAuthProvider> = ['GitHub', 'Google'];

watch(user, async (user) => user && await navigateTo(`/@${user.username}`));

async function verifyEmail() {
  const data: Record<string, string> = {
    email: emailComp.value?.$el.value,
  };

  if (!data.email) {
    createToast('Fill all required fields.');
    return;
  }

  state.value = 'loading';

  kfetch('/api/auth/verify-email', {
    method: 'POST',
    body: data,
  })
    .then(() => {
      state.value = 'success';
    })
    .catch((error) => {
      state.value = 'error';

      createToast(error.data.message || ERROR_MESSAGES.DEFAULT);
    });
}

function register() {
  const data: Record<string, string | undefined> = {
    code: verificationCode,
    email: emailComp.value?.$el.value,
    username: usernameComp.value?.$el.value,
    password: passwordComp.value?.$el.value,
  };

  if (!data.email || !data.username || !data.password) {
    createToast('Fill all required fields.');
    return;
  }

  state.value = 'loading';

  // generic workspace path
  preloadRouteComponents('/@a');

  kfetch('/api/auth/register', {
    method: 'POST',
    body: data,
    responseType: 'json',
    headers: { Accept: 'application/json' },
  })
    .then((res) => user.value = res.data)
    .catch((error) => {
      state.value = 'error';

      createToast(error.data.message || ERROR_MESSAGES.DEFAULT);
    });
}

onMounted(async () => {
  if (verificationCode) {
    await router.replace(window.location.pathname);
  }
});
</script>

<template>
  <NavSimple v-once />

  <main v-once class="register">
    <WithFadeTransition>
      <Form
        v-if="state !== 'success'"
        :action="emailVerified ? '/api/auth/register' : '/api/auth/verify-email'"
        method="POST"
        @submit.prevent="emailVerified ? register() : verifyEmail()"
      >
        <FormHiddenValue
          name="browserAction"
          value="true"
        />

        <FormHiddenValue
          v-if="verificationCode"
          name="code"
          :value="verificationCode"
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
            :disabled="emailVerified"
            :value="email"
          />
        </FormItem>

        <template v-if="emailVerified">
          <FormItem>
            <FormLabel target="username">
              Username
            </FormLabel>

            <FormInput
              id="username"
              ref="usernameComp"
              type="text"
              name="username"
              placeholder="username (no spaces allowed)"
              autocomplete="username"
              minlength="3"
              :pattern="usernameRE.source"
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
              autocomplete="new-password"
              minlength="8"
            />
          </FormItem>
        </template>

        <FormItem v-if="!emailVerified" actions>
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

        <FormItem v-else actions>
          <FormButton
            type="submit"
            :loading="state === 'loading'"
          >
            Start Keycaping
          </FormButton>
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
