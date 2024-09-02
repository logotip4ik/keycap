<script setup lang="ts">
import { OAuthProvider, usernameRE } from '~/server/utils';
import { logger } from '~/server/utils/logger';

definePageMeta({
  middleware: ['redirect-dashboard'],
});

const { query } = useRoute();
const event = useRequestEvent()!;
const identifier = getRequestIP(event, { xForwardedFor: true });

if (!query.code || !query.provider) {
  await logger.error(event, {
    msg: 'not enough data for proceeding with username',
    nuxt: true,
    identifier,
  });

  throw createError({
    status: 400,
    message: 'not enough data',
  });
}

const provider = isArray(query.provider)
  ? query.provider[0]
  : query.provider;

const normalizedProvider = OAuthProvider[provider as keyof typeof OAuthProvider || ''];

if (!normalizedProvider) {
  await logger.warn(event, {
    msg: 'someone is messing with oauth',
    nuxt: true,
    identifier,
  });

  throw createError({
    status: 400,
    message: 'Go home. Please.',
  });
}

const queryFlags = [
  'code',
  'state',
  'error',
  'socialUser',
];

const notEmptyQuery = Object.fromEntries(
  Object
    .entries(query)
    .filter(([key, value]) => !!value && queryFlags.includes(key)),
);
</script>

<template>
  <NavSimple v-once />

  <WithBlob v-once v-slot="props" top="45%">
    <div class="username-page" v-bind="props">
      <Form
        :action="`/api/oauth/${normalizedProvider.toLowerCase()}`"
      >
        <!-- Preserves original oauth query -->
        <FormHiddenValue
          v-for="(value, key) in notEmptyQuery"
          :key="`${key}`"
          :name="`${key}`"
          :value="`${value}`"
        />

        <FormTitle>
          Enter your username
        </FormTitle>

        <FormItem>
          <FormLabel target="username">
            Username
          </FormLabel>

          <FormInput
            id="username"
            type="text"
            name="username"
            placeholder="username (no spaces allowed)"
            autocomplete="username"
            minlength="3"
            :pattern="usernameRE.source"
            autofocus="true"
          />

          <FormInputNote>
            <template v-if="!query.usernameTaken">
              &nbsp;* this will be used as path to your notes
            </template>

            <template v-else>
              &nbsp;"{{ query.usernameTaken }}" username is already taken
            </template>
          </FormInputNote>
        </FormItem>

        <FormItem actions>
          <FormButton type="submit">
            Submit
          </FormButton>
        </FormItem>
      </form>
    </div>
  </WithBlob>
</template>

<style lang="scss">
.username-page {
  padding-top: 27.5vh;
}

._blob::after {
  --appear-animation: appear 2s 0.5s ease-out forwards;
  --size: 20vmin;
  --blur-divider: 1.75;

  content: "";

  position: absolute;
  top: var(--t, 75%);
  right: 7.5%;
  z-index: -1;

  width: var(--size);
  height: var(--size);

  border-radius: 50%;
  background-color: var(--task-list-indicator-color);

  opacity: 0;
  animation: var(--appear-animation);
  filter: blur(calc(var(--size) / var(--blur-divider)));

  @media (prefers-reduced-motion: no-preference) {
    animation: var(--appear-animation), blob-anim 20s infinite linear alternate;
  }

  @media (max-width: $breakpoint-tablet) {
    --size: 30vmin;
    --blur-divider: 2;
  }
}

@keyframes appear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes blob-anim {
  0% {
    width: 20vmin;
    height: 20vmin;

    transform: translate(0px, 0px) rotate(0deg);
  }

  25% {
    width: 25vmin;
    height: 20vmin;

    transform: translate(1vmax, 0px) rotate(0deg);
  }

  50% {
    width: 25vmin;
    height: 30vmin;

    transform: translate(0.5vmax -1vmax) rotate(0deg);
  }

  75% {
    width: 20vmin;
    height: 22.5vmin;

    transform: translate(-1vmax, 1vmax) rotate(0deg);
  }

  100% {
    width: 25vmin;
    height: 21.5vmin;

    transform: translate(-0.5vmax, 0.25vmax) rotate(0deg);
  }
}
</style>
