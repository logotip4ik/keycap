<script setup lang="ts">
import type { Folder, Note, Prisma } from '@prisma/client';

interface Props { item: NoteMinimal }
const props = defineProps<Props>();

const currentItemForDetails = useCurrentItemForDetails();
const createToast = useToast();

const isLoadingItemDetails = ref(false);
const itemDetailsEl = shallowRef<HTMLElement | null>(null);

const path = props.item.path.split('/').slice(2).join('/');

const isFolder = 'root' in props.item;

type Metadata = Pick<Note, 'updatedAt' | 'createdAt'> | Pick<Folder, 'updatedAt' | 'createdAt'>;
type NoteDetails = Prisma.NoteGetPayload<{ select: { shares: { select: { link: true; updatedAt: true; createdAt: true } } } }>;
type ItemDetails = Prettify<Metadata & Partial<NoteDetails>>;

// NOTE(perf improvement): client bundle size reduced by using only useAsyncData or useFetch
const { data: details, refresh } = await useAsyncData(async () => {
  const res = await $fetch<{ data: ItemDetails }>(
    isFolder ? `/api/folder/${path}` : `/api/note/${path}`,
    { query: { details: true } },
  );

  return res.data;
}, {
  lazy: true,
  server: false,
  immediate: false,
});

const mergedDetails = computed(() => {
  if (!details.value) return null;

  // NOTE: maybe use `options.tranform` from useAsyncData ?
  return {
    name: props.item.name,
    ...details.value,
    shares: details.value.shares?.[0],
  };
});

const rowsData = [
  { title: 'Last update', value: computed(() => formatDate(mergedDetails.value?.updatedAt)) },
  { title: 'Created at', value: computed(() => formatDate(mergedDetails.value?.createdAt)) },
];

function unsetCurrentItemForDetails() {
  details.value = null; // clearing details from prev request
  currentItemForDetails.value = null;
}

let prevPopupHeight: number | null;
function storePopupHeight() {
  prevPopupHeight = itemDetailsEl.value!.clientHeight;
}

function transitionHeight(_: any, done: () => void) {
  const newHeight = itemDetailsEl.value!.clientHeight;

  if (!prevPopupHeight)
    return;

  const heightDifference = Math.abs(prevPopupHeight - newHeight);

  if (heightDifference < 2)
    return;

  const animation = itemDetailsEl.value!.animate([
    { height: `${prevPopupHeight}px` },
    { height: `${newHeight}px` },
  ], { duration: 400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });

  animation.addEventListener('finish', () => done());
}

function formatDate(dateString?: Date | string) {
  if (!dateString) return '';

  const date = new Date(dateString);

  return Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

async function copyShareLink() {
  if (!mergedDetails.value?.shares) return;

  const { protocol, host } = window.location;
  const link = mergedDetails.value?.shares.link;

  await navigator.clipboard.writeText(`${protocol}//${host}/view/${link}`);

  createToast('Copied share link');
}

async function trapFocusInsideDetails(event: Event) {
  if (itemDetailsEl.value) {
    const trapFocus = (await import('focus-trap-js')).default;

    trapFocus(event, itemDetailsEl.value);
  }
}

const debouncedToggleShareLink = debounce(toggleShareLink, 250);
function toggleShareLink(isCreateRequest: boolean) {
  if (isLoadingItemDetails.value)
    return;

  const notePath = currentItemForDetails.value!.path.split('/').slice(2).join('/');

  isLoadingItemDetails.value = true;

  $fetch(`/api/share/note/${notePath}`, {
    method: isCreateRequest ? 'POST' : 'DELETE',
  })
    .then(() => refresh())
    .finally(() => isLoadingItemDetails.value = false);
}

useTinykeys({ Escape: unsetCurrentItemForDetails });
useClickOutside(itemDetailsEl, unsetCurrentItemForDetails);

onBeforeMount(() => refresh());
onMounted(() => {
  if (itemDetailsEl.value) {
    itemDetailsEl.value.focus();

    onBeforeUnmount(
      on(itemDetailsEl.value, 'keydown', trapFocusInsideDetails),
    );
  }
});
</script>

<template>
  <div class="item-details__wrapper fast-fade">
    <div
      id="item-details"
      ref="itemDetailsEl"
      role="dialog"
      class="item-details"
      aria-modal="true"
      aria-labelledby="item-details-dialog-title"
      tabindex="0"
    >
      <button class="item-details__close-button" @click="unsetCurrentItemForDetails">
        <LazyIconCloseRounded v-once class="item-details__close-button__icon" />
      </button>

      <Transition name="fade" appear @before-leave="storePopupHeight" @enter="transitionHeight">
        <WorkspaceItemDetailsSkeleton v-if="!mergedDetails" key="skeleton" />

        <!-- TODO: split into smaller components -->
        <div v-else-if="mergedDetails" key="content" class="item-details__data">
          <p
            v-once
            id="item-details-dialog-title"
            class="item-details__data__title"
            :aria-label="`Details: ${mergedDetails.name}`"
          >
            {{ mergedDetails.name }}
          </p>

          <div v-if="!isFolder" class="item-details__data__row item-details__data__row--share">
            <p class="item-details__data__row__title">
              Note share
            </p>

            <hr class="item-details__data__row__hr">

            <button
              class="item-details__data__row__share-link"
              :disabled="!mergedDetails.shares || isLoadingItemDetails"
              @click="copyShareLink"
            >
              <Transition name="fade">
                <!-- NOTE: skeleton class add appear delay -->
                <span v-if="isLoadingItemDetails" class="skeleton">Loading...</span>
                <span v-else-if="mergedDetails.shares">{{ mergedDetails.shares.link }}</span>
                <span v-else>Disabled</span>
              </Transition>
            </button>

            <input
              :checked="!!mergedDetails.shares"
              :readonly="isLoadingItemDetails"
              type="checkbox"
              class="item-details__data__row__checkbox"
              @input="debouncedToggleShareLink(!mergedDetails?.shares)"
            >
          </div>

          <div v-for="(data, key) in rowsData" :key="key" class="item-details__data__row">
            <p class="item-details__data__row__title">
              {{ data.title }}
            </p>

            <hr class="item-details__data__row__hr">

            <Transition name="fade">
              <p :key="data.value.value" class="item-details__data__row__value">
                {{ data.value.value }}
              </p>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.item-details {
  position: relative;
  z-index: 1;

  width: 90%;
  max-width: $breakpoint-tablet;

  padding: 2rem 1.25rem 1.5rem;

  border-radius: 0.5rem;
  border: 1px solid hsla(var(--text-color-hsl), 0.1);
  background-color: rgba(var(--surface-color-hsl), 0.98);
  box-shadow:
    inset -1px -1px 0.1rem rgba($color: #000000, $alpha: 0.025),
    1.3px 1.3px 5.3px rgba(0, 0, 0, 0.028),
    4.5px 4.5px 17.9px rgba(0, 0, 0, 0.042),
    20px 20px 80px rgba(0, 0, 0, 0.07);

  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(5px);
    background-color: hsla(var(--surface-color-hsl), 0.5);
  }

  @media (max-width: $breakpoint-tablet) {
    width: 100%;
    max-width: unset;

    padding-block-start: 3rem;

    border: none;
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

    @media (max-width: $breakpoint-tablet) {
      align-items: stretch;
    }

    @supports (backdrop-filter: blur(1px)) {
      background-color: hsla(var(--surface-color-hsl), 0.25);
      backdrop-filter: blur(8px);
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
    border-radius: 0.2rem;
    outline: 1px transparent solid;
    outline-offset: -1px;
    background-color: transparent;

    cursor: pointer;

    transition: color, outline-color, outline-offset, background-color;
    transition-duration: .3s;

    @media (hover: hover) {
      color: hsla(var(--text-color-hsl), 0.65);
    }

    &:is(:hover, :focus-visible) {
      color: hsla(var(--text-color-hsl), 1);
      background-color: hsla(var(--selection-bg-color-hsl), 0.075);

      outline: 1px solid hsla(var(--selection-bg-color-hsl), 0.45);
      outline-offset: 0px;

      transition-duration: .1s;

      @media (prefers-color-scheme: dark) {
        background-color: hsla(var(--selection-bg-color-hsl), 0.175);
        outline-color: hsla(var(--selection-bg-color-hsl), 0.65);
      }
    }

    &__icon {
      width: auto;
      height: 65%;
    }
  }

  &__data {
    &__title {
      font-size: clamp(1.25rem, 2vw + 0.75rem, 2rem);
      margin: 0;
      margin-bottom: 2.25rem
    }

    &__row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 1.1rem;
      color: hsla(var(--text-color-hsl), 0.75);

      & + & {
        margin-top: 1.125rem;
      }

      &--share {
        margin-bottom: -0.25rem;
      }

      &__hr {
        flex: 1;

        width: 100%;
        height: 0.1rem;

        margin: 0 1rem;

        border: none;
        background-color: hsla(var(--text-color-hsl), 0.1);
      }

      &__title,
      &__value {
        margin: 0;
      }

      &__checkbox {
        transform: scale(1.75);

        margin-left: 0.2rem;
        margin-right: 0.35rem;

        cursor: pointer;
        accent-color: var(--task-list-indicator-color);
      }

      &__share-link {
        --base-padding-y: 0.225rem;

        font: inherit;
        text-align: center;
        color: hsla(var(--text-color-hsl), 0.95);

        width: 16.75ch;

        margin-right: 1rem;
        padding: var(--base-padding-y) 0 calc(var(--base-padding-y) - 0.075rem);

        white-space: nowrap;

        cursor: pointer;
        border: none;
        border-radius: 0.125rem;
        background-color: transparent;
        outline: 1px solid hsla(var(--text-color-hsl), 0.25);

        transition: width .2s, background-color .3s;

        &:disabled {
          color: hsla(var(--text-color-hsl), 0.75);

          width: 10ch;

          cursor: default;

          transition-duration: .4s;
        }

        &:focus-visible {
          outline: 1px solid hsla(var(--text-color-hsl), 0.25);
          box-shadow:
            0 0 0 5px hsla(var(--selection-bg-color-hsl), 0.75),
            0 0 0 10px hsla(var(--selection-bg-color-hsl), 0.25);
          transition-duration: 0s;
        }

        &:active:not(:disabled) {
          background-color: hsla(var(--text-color-hsl), 0.05);
          transition-duration: 0s;
        }
      }
    }
  }

  .skeleton {
    padding: 0;
  }
}
</style>
