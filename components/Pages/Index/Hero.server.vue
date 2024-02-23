<script setup lang="ts">
const { build } = useRuntimeConfig().public;
</script>

<template>
  <div class="container">
    <WithBlob v-slot="props">
      <header class="index__header" v-bind="props">
        <small class="index__header__alert">
          <LazyIconWarning v-once class="index__header__alert__icon" />
          {{ build.version }} (in development)
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
</template>
