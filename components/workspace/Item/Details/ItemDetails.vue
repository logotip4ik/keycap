<script setup lang="ts">
interface Props { item: NoteMinimal }
const props = defineProps<Props>();

const isFolder = 'root' in props.item;

const itemDetailsEl = ref<HTMLElement | null>(null);

const currentItemForDetails = useCurrentItemForDetails();

const { data: details } = useLazyFetch(
  // /api/[note|folder]/[item path without username]
  `/api/${isFolder ? 'folder' : 'note'}/${props.item.path.split('/').slice(2).join('/')}`,
  { query: { details: true }, retry: 2 });

const mergedDetails = computed(() => {
  if (!details.value) return null;

  return { ...props.item, ...details.value };
});

function unsetCurrentItemForDetails() {
  currentItemForDetails.value = null;
}

let prevPopupHeight: number | null;
function storeHeight() {
  prevPopupHeight = itemDetailsEl.value!.clientHeight;
}

async function transitionHeight(_: any, done: () => void) {
  const newHeight = itemDetailsEl.value!.clientHeight;

  if (prevPopupHeight === newHeight)
    return;

  const animation = itemDetailsEl.value!.animate([
    { height: `${prevPopupHeight}px` },
    { height: `${newHeight}px` },
  ], { duration: 400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });

  animation.addEventListener('finish', () => done());
}

useClickOutside(itemDetailsEl, unsetCurrentItemForDetails);
useTinykeys({ Escape: unsetCurrentItemForDetails });
</script>

<template>
  <div class="item-details__wrapper fast-fade">
    <section ref="itemDetailsEl" class="item-details">
      <button class="item-details__close-button" @click="unsetCurrentItemForDetails">
        <Icon name="close" class="item-details__close-button__icon" />
      </button>

      <Transition name="fade" :css="false" @before-leave="storeHeight" @enter="transitionHeight">
        <div v-if="mergedDetails" key="content" class="something">
          {{ mergedDetails }}
        </div>

        <WorkspaceItemDetailsSkeleton v-else key="skeleton" />
      </Transition>
    </section>
  </div>
</template>

<style lang="scss">
.item-details {
  position: relative;
  z-index: 1;
  isolation: isolate;

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

    @media screen and (max-width: $breakpoint-tablet) {
      align-items: stretch;
    }

    @supports (backdrop-filter: blur(1px)) {
      background-color: hsla(var(--surface-color-hsl), 0.25);
      backdrop-filter: blur(0.35rem);
    }
  }

  &__close-button {
    --size: clamp(2rem, 3vw + 1.5rem, 2.5rem);

    position: absolute;
    top: calc(var(--size) / 6);
    right: calc(var(--size) / 6);

    width: var(--size);
    height: var(--size);

    border: none;
    outline-color: transparent;
    background-color: transparent;

    cursor: pointer;

    &__icon {
      width: auto;
      height: 65%;
    }
  }

  .skeleton {
    padding: 0;
  }
}
</style>
