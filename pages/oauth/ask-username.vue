<script setup lang="ts">
const usernameInput = ref<HTMLInputElement | null > (null);
const { query } = useRoute();

if (!query.code || !query.provider)
  await navigateTo('/');
</script>

<template>
  <NavSimple />

  <div class="username-page">
    <form
      class="username-page__form"
      :action="`/api/oauth/${query.provider}`"
    >
      <!-- Preserves original oauth query -->
      <input
        v-for="(value, key) in query"
        :key="key.toString()"
        :name="key.toString()"
        :value="value?.toString()"
        type="text"
        class="username-page__form__hidden"
      >

      <p class="username-page__form__title font-wide">
        Enter your username
      </p>

      <div class="username-page__form__item">
        <input
          id="register-username"
          ref="usernameInput"
          type="text"
          name="username"
          class="username-page__form__item__input"
          placeholder="username, no spaces allowed"
          autocomplete="username"
          minlength="3"
          required
        >

        <small class="username-page__form__item__note username-page__form__item__note--bottom">
          <template v-if="!query.usernameTaken">
            &nbsp;* this will be used as path to your notes
          </template>

          <template v-else>
            &nbsp;"{{ query.usernameTaken }}" username is already taken
          </template>
        </small>
      </div>

      <div class="username-page__form__item username-page__form__item--actions">
        <button
          type="submit"
          class="username-page__form__item__button"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
.username-page {
  position: relative;
  isolation: isolate;

  width: 95%;
  height: 100vh;
  height: 100svh;

  max-width: 1200px;

  padding: 27vh 0 0;
  margin: 0 auto;

  &__form {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;

    margin: 0 auto;

    width: 95%;
    max-width: 450px;

    padding: clamp(1rem, 2vw, 2rem);

    &__title {
      font-size: 2rem;
      font-weight: 500;
      text-align: left;

      padding-top: 1rem;
      margin: 0 0 2.5rem 0;
    }

    &__hidden {
      display: none;
    }

    &__item {
      position: relative;
      z-index: 1;

      width: 100%;

      & + & {
        margin-top: 1.25rem;
      }

      &--actions {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;

        text-align: center;

        margin-top: 3.5rem !important;
      }

      &__label {
        display: block;

        font-size: 0.95rem;
        font-weight: 500;

        opacity: 0.75;

        margin-bottom: 0.25rem;

        transition: opacity 0.3s;
      }

      &__input {
        font: inherit;
        font-size: 1rem;
        line-height: 1.75;
        color: currentColor;

        width: 100%;

        padding: 0.75rem 0.75rem;

        appearance: none;
        border-radius: 0.5rem;
        border: 1px solid rgba($color: grey, $alpha: 0.5);
        background-color: transparent;

        transition: border-color 0.3s;

        &:is(:focus-visible, :hover) {
          outline: none;

          border-color: grey;

          transition: border-color 0.1s;
        }
      }

      &__note {
        display: block;

        margin-block: 0.25rem;

        opacity: 0.75;
      }

      &__button {
        font: inherit;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--surface-color);
        text-decoration: none;
        white-space: nowrap;

        width: 90%;
        max-width: 330px;

        padding: 1rem 2rem;

        border: none;
        border-radius: 0.5rem;
        outline: 1px solid transparent;
        outline-offset: -1px;
        background-color: var(--text-color);
        box-shadow: 0 0 1rem hsla(var(--text-color-hsl), 0.125);

        cursor: pointer;
        transition: outline .3s, outline-offset .3s;

        &:focus {
          outline-style: solid;
        }

        &:is(:hover, :focus-visible) {
          outline-color: var(--text-color);
          outline-offset: 0.25rem;

          transition: outline-color 0.1s, outline-offset 0s;
        }
      }
    }
  }

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
