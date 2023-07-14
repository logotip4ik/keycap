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

  <div class="username-page">
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
</template>

<style lang="scss">
.username-page {
  padding-top: 27.5vh;

  &::after {
    --appear-animation: appear 2s 1.5s ease-out forwards;
    --size: 20vmin;
    --blur-divider: 1.75;

    content: "";

    position: absolute;
    top: 65%;
    right: 7.5%;
    z-index: -1;

    width: var(--size);
    height: var(--size);

    border-radius: 50%;
    background-color: var(--loading-indicator-color);

    animation: var(--appear-animation);
    filter: blur(calc(var(--size) / var(--blur-divider)));

    @media (prefers-reduced-motion: no-preference) {
      animation: var(--appear-animation), blob-anim 20s infinite linear alternate;
    }

    @media screen and (max-width: $breakpoint-tablet) {
      --size: 30vmin;
      --blur-divider: 2;
    }
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
