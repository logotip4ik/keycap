<script setup lang="ts">
const { build } = useRuntimeConfig().public;

const lastTimeBuild = Intl.DateTimeFormat('en-UK', { dateStyle: 'medium' }).format(build.time);
const shortCommitSha = build.commit;
</script>

<template>
  <main class="index">
    <!-- TODO: actually craft landing page -->

    <NavLogin />

    <div class="container">
      <WithBlob v-slot="props">
        <header class="index__header" v-bind="props">
          <small class="index__header__alert">
            <IconWarning class="index__header__alert__icon" />
            In development
          </small>

          <h1 class="index__header__title font-wide">
            Keycap
          </h1>

          <p class="index__header__subtitle">
            Another note taking webapp ❤.
            <br>
            Simple, fast and purple.
          </p>
        </header>
      </WithBlob>
    </div>

    <p class="index__build-info">
      Last build at {{ lastTimeBuild }}
      <br>
      Commit sha:
      <NuxtLink
        class="index__build-info__commit-link"
        target="_blank"
        :href="`https://github.com/logotip4ik/keycap/tree/${shortCommitSha}`"
      >
        {{ shortCommitSha }}
      </NuxtLink>
    </p>
  </main>
</template>

<style lang="scss">
.index {
  min-height: 100vh;
  min-height: 100svh;

  overflow: hidden;

  .container {
    width: 92.5%;
    max-width: 1300px;

    margin: 0 auto;
  }

  &__header {
    position: relative;
    z-index: 0;
    isolation: isolate;

    width: 100%;
    max-width: 1100px;

    margin: 0 auto;
    padding-top: 30vh;
    padding-top: 30svh;

    &__alert {
      display: inline-block;

      color: hsla(var(--text-color-hsl), 0.8);

      padding: 0.5rem 0.75rem;
      margin-bottom: 0.5rem;

      border-radius: 0.25rem;
      border: 1px solid hsla(var(--selection-bg-color-hsl), 0.5);
      background-color: hsla(var(--selection-bg-color-hsl), 0.125);

      @media (prefers-color-scheme: dark) {
        background-color: hsla(var(--selection-bg-color-hsl), 0.25);
      }

      &__icon {
        margin-right: 0.25rem;

        vertical-align: baseline  !important;

        transform: translateY(1.5px);
      }
    }

    &__title {
      font-size: max(5vw, 5rem);

      margin: 0;
      margin-bottom: 1.5rem;

      @media screen and (max-width: $breakpoint-tablet) {
        font-size: max(5vw, 4rem);
      }
    }

    &__subtitle {
      font-size: 1rem;
      line-height: 1.5;
      color: hsla(var(--text-color-hsl), 0.75);
    }
  }

  &__build-info {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;

    font-size: 0.9rem;
    text-align: center;
    line-height: 1.5;

    opacity: 0.5;
    transform: translate(-50%, 0);

    &__commit-link {
      font-family: monospace;
      color: currentColor;
      text-decoration: none;

      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      background-color: hsla(var(--selection-bg-color-hsl), 0.25)
    }
  }
}
</style>
