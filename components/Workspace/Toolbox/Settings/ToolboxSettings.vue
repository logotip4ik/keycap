<script setup lang="ts">
import FormatterPositionSetting from './Item/FormatterPosition.vue';

const settingComponents = [
  FormatterPositionSetting,
];
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
}
</style>
