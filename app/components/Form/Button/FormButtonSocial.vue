<script setup lang="ts">
import type { FlatCase } from 'scule';

const props = defineProps<{
  provider: OAuthProvider
}>();

const lowercaseProvider = computed(() => props.provider.toLowerCase() as FlatCase<OAuthProvider>);
</script>

<template>
  <a
    class="form__button form__button--social"
    :class="[`form__button--${lowercaseProvider}`]"
    :href="`/api/oauth/${lowercaseProvider}`"
  >
    <Icon :name="lowercaseProvider" />

    <slot />
  </a>
</template>

<style lang="scss">
.form__button {
  &.form__button--social {
    // Each social button should provide
    // --base-color
    // --base-text-color

    // overwrites hover outline color
    --text-color: hsl(var(--base-color));

    display: flex;
    justify-content: center;
    align-items: center;

    color: var(--base-text-color, var(--text-color));
    text-decoration: none;

    padding-block: 0.75rem;

    background-color: hsl(var(--base-color));

    svg {
      --w: calc(1.45rem + 0.25vw);

      flex-shrink: 0;

      display: block;

      width: 100%;
      height: auto;

      max-width: var(--w);

      margin-right: calc(var(--w) / 2);
    }
  }

  &--github {
    --base-color: 215, 15%, 16%;
    --base-text-color: white;
  }

  &--google {
    --base-color: 240, 5%, 92%;
    --base-text-color: hsl(0, 0%, 7%);

    @media (prefers-color-scheme: light) {
      --base-color: 240, 5%, 99%;
    }
  }
}
</style>
