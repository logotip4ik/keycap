<script setup lang="ts">
useSeoMeta({
  robots: { none: true },
  ogDescription: 'Another note taking webapp ❤.Simple, fast and purple.',
});

const { buildInfo } = useAppConfig();

const lastTimeBuild = Intl.DateTimeFormat('en-UK', { dateStyle: 'medium' }).format(buildInfo.time);
const shortCommitSha = buildInfo.commit;
</script>

<template>
  <main class="index">
    <!-- TODO: actually craft landing page -->

    <nav class="index__nav">
      <div class="container">
        <NuxtLink href="/login" class="index__nav__link">
          Have an account ?
        </NuxtLink>
      </div>
    </nav>

    <div class="container">
      <header class="index__header">
        <small class="index__header__alert">
          <Icon name="mi:warning" class="index__header__alert__icon" />
          In development
        </small>

        <h1 class="index__header__title">
          Keycap
        </h1>

        <p class="index__header__subtitle">
          Another note taking webapp ❤.
          <br>
          Simple, fast and purple.
        </p>
      </header>
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

  &__nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    isolation: isolate;

    width: 100%;

    padding: 2rem 1rem;

    .container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    &__link {
      font-size: max(1vw, 1rem);
      color: hsla(var(--text-color-hsl), 1);
      text-decoration: underline dashed 1px hsla(var(--selection-bg-color-hsl), 1);
      text-underline-offset: 3px;

      padding: 1rem 0;

      transition: color .3s;

      @media (hover: hover) {
        color: hsla(var(--text-color-hsl), 0.9);

        &:hover {
          color: hsla(var(--text-color-hsl), 1);
        }
      }
    }
  }

  &__header {
    position: relative;
    z-index: 1;
    isolation: isolate;

    width: 100%;
    max-width: 1100px;

    margin: 0 auto;
    padding-top: 30vh;
    padding-top: 30svh;

    &::after {
      --size: 20vmin;
      --blur-divider: 1.75;

      content: "";

      position: absolute;
      top: 75%;
      right: 7.5%;
      z-index: -1;

      width: var(--size);
      height: var(--size);

      border-radius: 50%;
      background-color: var(--loading-indicator-color);

      filter: blur(calc(var(--size) / var(--blur-divider)));

      @media screen and (max-width: $breakpoint-tablet) {
        --size: 30vmin;
        --blur-divider: 2;
      }
    }

    &__alert {
      display: inline-block;

      color: hsla(var(--text-color-hsl), 0.8);

      padding: 0.5rem 0.75rem;
      margin-bottom: 0.5rem;

      border-radius: 0.25rem;
      border: 1px solid hsla(var(--selection-bg-color-hsl), 0.75);
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
