<script setup lang="ts">
import type { Note, Prisma } from '@prisma/client';

interface Props { item: NoteMinimal }
const props = defineProps<Props>();

const currentItemForDetails = useCurrentItemForDetails();
const createToast = useToast();
const isLoadingItemDetails = ref(false);

const isFolder = 'root' in props.item;

type NoteDetails = Partial<Note> & Prisma.NoteGetPayload<{ select: { shares: { select: { link: true; updatedAt: true; createdAt: true } } } }>;

// NOTE(perf improvement): client bundle size reduced by using only useAsyncData or useFetch
const { data: details, refresh } = useLazyAsyncData<NoteDetails>(() => $fetch(
  // /api/[note|folder]/[item path without username]
  `/api/${isFolder ? 'folder' : 'note'}/${props.item.path.split('/').slice(2).join('/')}`,
  { query: { details: true }, retry: 2 },
));

const itemDetailsEl = ref<HTMLElement | null>(null);

const mergedDetails = computed(() => {
  if (!details.value) return null;

  return { ...props.item, ...details.value, shares: details.value.shares[0] };
});

const rowsData = computed(() => [
  { title: 'Last update', value: formatDate(mergedDetails.value?.updatedAt) },
  { title: 'Created at', value: formatDate(mergedDetails.value?.createdAt) },
]);

function unsetCurrentItemForDetails() {
  currentItemForDetails.value = null;
}

let prevPopupHeight: number | null;
function storePopupHeight() {
  prevPopupHeight = itemDetailsEl.value!.clientHeight;
}

function transitionHeight(_: any, done: () => void) {
  const newHeight = itemDetailsEl.value!.clientHeight;

  if (!prevPopupHeight || !newHeight || prevPopupHeight === newHeight)
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
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

async function copyShareLink() {
  if (!mergedDetails.value?.shares) return;

  const { protocol, host } = window.location;
  const link = mergedDetails.value?.shares.link;

  await navigator.clipboard.writeText(`${protocol}//${host}/view/${link}`);

  createToast('Copied share link');
}

const debouncedToggleShareLink = useDebounceFn(toggleShareLink, 250);
function toggleShareLink(needToCreate: boolean) {
  if (isLoadingItemDetails.value)
    return;

  const notePath = currentItemForDetails.value!.path.split('/').slice(2).join('/');

  isLoadingItemDetails.value = true;

  $fetch(`/api/share/note/${notePath}`, {
    method: needToCreate ? 'POST' : 'DELETE',
  })
    .then(() => refresh())
    .finally(() => isLoadingItemDetails.value = false);
}

useTinykeys({ Escape: unsetCurrentItemForDetails });
useClickOutside(itemDetailsEl, unsetCurrentItemForDetails);
</script>

<template>
  <div class="item-details__wrapper fast-fade">
    <section ref="itemDetailsEl" class="item-details">
      <button class="item-details__close-button" @click="unsetCurrentItemForDetails">
        <Icon name="close" class="item-details__close-button__icon" />
      </button>

      <Transition name="fade" appear @before-leave="storePopupHeight" @enter="transitionHeight">
        <WorkspaceItemDetailsSkeleton v-if="!mergedDetails" key="skeleton" />

        <!-- TODO: split into smaller components -->
        <div v-else-if="mergedDetails" key="content" class="item-details__data">
          <p class="item-details__data__title">
            {{ mergedDetails.name }}
          </p>

          <div v-if="!isFolder" class="item-details__data__row">
            <p class="item-details__data__row__title">
              Note share
            </p>

            <hr class="item-details__data__row__hr">

            <button
              class="item-details__data__row__share-link"
              @click="copyShareLink"
            >
              <Transition name="fade">
                <!-- NOTE: skeleton class add appear delay -->
                <span v-if="isLoadingItemDetails" class="skeleton">Wait...</span>
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

            <p class="item-details__data__row__value">
              {{ data.value }}
            </p>
          </div>
        </div>
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

  border-radius: 0.5rem;
  border: 1px solid hsla(var(--text-color-hsl), 0.125);
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
      background-color: hsla(var(--text-color-hsl), 0.075);

      outline-color: hsla(var(--text-color-hsl), 0.35);
      outline-offset: 0px;

      transition-duration: .1s;
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
        margin-top: 0.825rem;
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
        transform: scale(1.5);

        cursor: pointer;
        accent-color: var(--task-list-indicator-color);
      }

      &__share-link {
        font: inherit;
        text-align: center;

        width: 16.75ch;

        margin-right: 1rem;
        padding: 0.25rem 0;

        cursor: pointer;
        border: none;
        border-radius: 0.125rem;
        background-color: transparent;
        outline: 1px solid hsla(var(--text-color-hsl), 0.25);
      }
    }
  }

  .skeleton {
    padding: 0;
  }
}
</style>
