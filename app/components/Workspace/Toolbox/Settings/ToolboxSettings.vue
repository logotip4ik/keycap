<script setup lang="ts">
import type { AsyncComponentLoader } from 'vue';

const settings = import.meta.glob('./Item/*');

const settingComponents = Object
  .entries(settings)
  .sort(([a], [b]) => Number(a.split('.')[0]) - Number(b.split('.')[0]))
  .map(([_, loader]) => {
    return defineAsyncComponent(loader as AsyncComponentLoader);
  });
</script>

<template>
  <section class="toolbox__settings">
    <p class="toolbox__section__title">
      Settings:
    </p>

    <ul class="toolbox__section__list">
      <li
        v-for="(settingComponent, i) in settingComponents"
        :key="i"
        class="toolbox__section__list__item"
      >
        <Component :is="settingComponent" />
      </li>
    </ul>
  </section>
</template>

<style lang="scss">
.toolbox__settings {
  margin: auto 0 calc(var(--pd-y) * 0.66);

  &__setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;

    &__select {
      font-family: inherit;
      font-size: 0.9rem;
      color: inherit;
      line-height: inherit;
      text-align: center;
      text-align-last: center; // for some reason `text-align` in safari is not working

      min-width: 10ch;

      padding: 0.125rem 0.5rem;
      margin: 0;

      border: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
      border-radius: 0.25rem;
      background-color: hsla(var(--text-color-hsl), 0.015);

      cursor: pointer;
      appearance: none;
      transition: background-color 0.3s, border-color 0.3s;

      &:is(:hover, :focus-visible) {
        background-color: hsla(var(--text-color-hsl), 0.05);
        border-color: hsla(var(--selection-bg-color-hsl), 0.75);
        outline: none;

        transition-duration: 0.1s;
      }
    }
  }
}
</style>
