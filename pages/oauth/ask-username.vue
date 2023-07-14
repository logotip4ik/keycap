<script setup lang="ts">
const usernameInput = ref<HTMLInputElement | null>(null);
const { query } = useRoute();

if (!query.code || !query.provider)
  await navigateTo('/');

const notEmptyQuery = Object.fromEntries(
  Object
    .entries(query)
    .filter(([_, value]) => !!value),
);
</script>

<template>
  <NavSimple />

  <WithBlob v-slot="props" top="45%">
    <div class="username-page" v-bind="props">
      <Form
        :action="`/api/oauth/${query.provider}`"
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
          <FormInput
            id="username"
            ref="usernameInput"
            type="text"
            name="username"
            placeholder="username (no spaces allowed)"
            autocomplete="username"
            minlength="3"
            pattern="[\w,.-]+?"
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

        <FormItem class="form__actions" actions>
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
