<script setup lang="ts">
interface Props { modelValue: string }
interface Emits { (event: 'update:modelValue', content: string): void }

defineProps<Props>();
const emit = defineEmits<Emits>();

function updateModelValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <input
    id="workspace-search-input"
    ref="inputEl"
    type="search"
    required
    name="workspace-search"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="none"
    enterkeyhint="go"
    class="search__form__input"
    aria-autocomplete="both"
    spellcheck="false"
    autofocus="true"
    placeholder="Search or enter / for commands"
    maxlength="64"
    :value="modelValue"
    @input="updateModelValue"
  >
</template>
