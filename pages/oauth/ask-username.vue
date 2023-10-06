<script setup lang="ts">
import { OAuthProvider, usernameRE } from '~/server/utils';

if (import.meta.client) {
  throw createError({
    statusCode: 418,
    statusMessage: 'this page should not run on client',
  });
}

const user = useUser();
const event = useRequestEvent();
const { query } = useRoute();

const usernameInput = shallowRef<HTMLInputElement | null>(null);

if (user.value)
  await navigateTo(`/@${user.value.username}`);

if (!query.code || !query.provider) {
  await event.context.logger.error({ query, msg: 'not enough data for proceding with username' });

  throw createError({
    statusCode: 400,
    statusMessage: 'not enough data',
  });
}

const provider = Array.isArray(query.provider)
  ? (query.provider[0] || '')
  : query.provider;

const normalizedProvider = OAuthProvider[provider as keyof typeof OAuthProvider || ''];

if (!normalizedProvider) {
  await event.context.logger.warn('someone is messing with oauth');

  throw createError({
    statusCode: 400,
    statusMessage: 'Go home. Please.',
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
          :id="key.toString()"
          :key="key.toString()"
          :name="key.toString()"
          :value="value!.toString()"
          type="text"
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
            ref="usernameInput"
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
</style>
