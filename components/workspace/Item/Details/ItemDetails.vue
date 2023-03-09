<script setup lang="ts">
interface Props { item: NoteMinimal }
const props = defineProps<Props>();

const itemDetailsEl = ref(null);
const details = /* useFetch */ ref(null);

const currentItemForDetails = useCurrentItemForDetails();

useClickOutside(itemDetailsEl, () => currentItemForDetails.value = null);
</script>

<template>
  <div class="item-details__wrapper fast-fade">
    <section ref="itemDetailsEl" class="item-details">
      <Transition name="fade">
        <div v-if="details" key="content" class="something" />

        <WorkspaceItemDetailsSkeleton v-else key="skeleton" />
      </Transition>
    </section>
  </div>
</template>

<style lang="scss">
.item-details {
  width: 90%;
  max-width: $breakpoint-tablet;

  padding: 2rem 1.25rem 1.75rem;

  border-radius: 0.25rem;
  background-color: rgba(var(--surface-color-hsl), 0.98);
  box-shadow:
    inset -1px -1px 0.1rem rgba($color: #000000, $alpha: 0.025),
          2px 1.3px 2.1px rgba(0, 0, 0, 0.024),
          6.7px 4.5px 7.1px rgba(0, 0, 0, 0.036),
          30px 20px 32px rgba(0, 0, 0, 0.06);

  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(5px);
    background-color: hsla(var(--surface-color-hsl), 0.5);
  }

  @media screen and (max-width: $breakpoint-tablet) {
    width: 100%;
    max-width: unset;

    border-radius: 0;
  }

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;

    width: 100%;
    height: 100%;

    background-color: hsla(var(--surface-color-hsl), 0.9);

    @supports (backdrop-filter: blur(1px)) {
      background-color: hsla(var(--surface-color-hsl), 0.25);
      backdrop-filter: blur(0.5rem);
    }
  }

  .skeleton {
    padding: 0;
  }
}
</style>
