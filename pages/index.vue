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
      <header class="index__header">
        <small class="index__header__alert">
          <Icon name="mi:warning" class="index__header__alert__icon" />
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

    &::after {
      --appear-animation: appear 2s 1.5s ease-out forwards;

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

      opacity: 0;
      animation: var(--appear-animation);
      filter: blur(calc(var(--size) / var(--blur-divider)));

      @media (prefers-reduced-motion: no-preference) {
        animation:  var(--appear-animation), blob-anim 20s infinite linear alternate;
      }

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
