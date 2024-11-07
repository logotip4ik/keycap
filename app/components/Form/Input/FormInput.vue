<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  name: string
  type: 'email' | 'text' | 'password'
  placeholder: string
  autocomplete: string
  minlength: string | number
  pattern?: string
  required?: boolean
  value?: string
  onUpdateValue?: (text: string) => void
}>(), {
  required: true,
});
</script>

<template>
  <input
    :id="id"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    class="form__input"
    :required="required"
    :minlength="minlength"
    :pattern="pattern"

    :value="value"
    @input="onUpdateValue?.(($event.target as HTMLInputElement).value)"
  >
</template>

<style lang="scss">
.form__input {
  font: inherit;
  font-size: 1rem;
  line-height: 1.75;
  color: currentColor;

  width: 100%;

  padding: 0.75rem;

  appearance: none;
  border-radius: 0.5rem;
  border: 1px solid hsla(var(--text-color-hsl), 0.125);
  box-shadow: 0 0 1rem hsla(var(--text-color-hsl), 0.025);
  background-color: transparent;

  transition: border-color 0.3s, box-shadow 0.3s;

  &:not(:disabled):is(:focus-visible, :hover) {
    outline: none;

    border-color: hsla(var(--text-color-hsl), 0.25);
    box-shadow: 0 0 1rem hsla(var(--text-color-hsl), 0.05);

    transition: border-color 0.1s, box-shadow 0.1s;
  }

  &:focus-visible {
    border-color: hsla(var(--text-color-hsl), 0.5);
  }

  &:user-invalid {
    border-color: var(--error-color);
    box-shadow: 0 0 1rem hsla(var(--error-color-hsl), 0.175);
  }

  &:disabled {
    color: hsla(var(--text-color-hsl), 0.5);
  }
}
</style>
