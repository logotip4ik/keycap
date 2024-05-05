<script setup lang="ts">
const { setting, posibleValues } = useSetting(settings.formatterPosition);
</script>

<template>
  <div class="toolbox__settings__fmt-pos">
    Formatter position

    <select v-model="setting" class="toolbox__settings__fmt-pos__select">
      <option v-for="value in posibleValues" :key="value" :value="value">
        {{ value }}
      </option>
    </select>
  </div>
</template>

<style lang="scss">
.toolbox__settings__fmt-pos {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__select {
    font-family: inherit;
    font-size: 0.9rem;
    line-height: inherit;
    text-align: center;

    min-width: 10ch;

    padding: 0.125rem 0.5rem;
    margin: 0;

    border: 1px solid hsla(var(--selection-bg-color-hsl), 0.25);
    border-radius: 0.25rem;
    background-color: transparent;

    cursor: pointer;
    appearance: none;
    transition: background-color 0.3s, border-color 0.3s;

    &:is(:hover, :focus-visible) {
      background-color: hsla(var(--selection-bg-color-hsl), 0.1);
      border-color: hsla(var(--selection-bg-color-hsl), 0.75);

      transition-duration: 0.1s;
    }
  }
}
</style>
