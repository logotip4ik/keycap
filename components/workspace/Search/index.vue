<script setup lang="ts">
interface Emits { (e: 'close'): void }
const emit = defineEmits<Emits>();

const input = ref<HTMLElement | null>(null);
const searchInput = ref('');

defineExpose({ input });

function handleCancel(event: Event) {
  emit('close');

  searchInput.value = '';
}

onMounted(() => {
  input.value?.focus();
});

useTinykeys({ Escape: handleCancel });
</script>

<template>
  <div class="search-wrapper" @click.self="handleCancel">
    <div class="search">
      <form class="search__form" @submit.prevent>
        <input
          id="workspace-search-input"
          ref="input"
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
        >
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.search {
  width: 90%;
  max-width: 600px;

  margin: 0 auto;
  padding: 0.5rem;

  border: 1px solid hsla(var(--text-color-hsl), 0.125);
  border-radius: 0.5rem;
  background-color: var(--surface-color);
  box-shadow:
      1.3px 2.7px 5.3px rgba(0, 0, 0, 0.02),
      4.5px 8.9px 17.9px rgba(0, 0, 0, 0.03),
      20px 40px 80px rgba(0, 0, 0, 0.05);

  &-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;

    padding-top: 33vh;

    background-color: hsla(var(--surface-color-hsl), 0.9);

    @supports (backdrop-filter: blur(1px)) {
      background-color: hsla(var(--surface-color-hsl), 0.25);
      backdrop-filter: blur(0.5rem);
    }
  }

  &__form {

    &__input {
      font: inherit;
      font-size: 1.75rem;
      color: currentColor;

      width: 100%;

      padding: 0.75rem 1.25rem;

      border: 1px solid var(--loading-indicator-color);
      border-radius: 0.25rem;
      appearance: none;
      background-color: transparent;

      &:is(:hover, :focus-visible) {
        outline: none;
        border-color: var(--task-list-indicator-color);
      }
    }
  }
}
</style>
