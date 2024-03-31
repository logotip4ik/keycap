<script setup lang="ts">
const props = defineProps<{ item: NoteMinimal | FolderMinimal }>();

const currentItemForDetails = useCurrentItemForDetails();
const createToast = useToaster();

const isLoadingItemDetails = ref(false);
const itemDetailsComp = shallowRef<ComponentPublicInstance | null>(null);
const itemDetailsEl = computed(() => itemDetailsComp.value?.$el as HTMLElement | undefined);

const path = props.item.path.split('/').slice(2).join('/');

const isFolder = checkIsFolder(props.item);

type ItemDetails = Prettify<ItemMetadata & Partial<NoteShare>>;

// NOTE(perf improvement): client bundle size reduced by using only useAsyncData or useFetch
const { data: details, refresh } = useAsyncData(async () => {
  const res = await $fetch<{ data: ItemDetails }>(
    isFolder ? `/api/folder/${path}` : `/api/note/${path}`,
    { query: { details: true } },
  );

  return res.data;
}, {
  lazy: true,
  server: false,
  immediate: false,
  transform: (details) => ({
    ...details,
    name: props.item.name,
    shares: details.shares?.[0],
  }),
});

const rowsData = [
  { title: 'Last update', value: computed(() => formatDate(details.value?.updatedAt)) },
  { title: 'Created at', value: computed(() => formatDate(details.value?.createdAt)) },
];

function unsetCurrentDetailsItem() {
  details.value = null; // clearing details from prev request
  currentItemForDetails.value = null;
}

let prevPopupHeight: number | null;
function rememberHeight() {
  prevPopupHeight = itemDetailsEl.value!.clientHeight;
}

function transitionHeight(_el: Element, done: () => void) {
  const newHeight = itemDetailsEl.value!.clientHeight;

  if (!prevPopupHeight) {
    return;
  }

  const heightDifference = Math.abs(prevPopupHeight - newHeight);

  if (heightDifference < 2) {
    return;
  }

  const animation = itemDetailsEl.value!.animate([
    { height: `${prevPopupHeight}px` },
    { height: `${newHeight}px` },
  ], { duration: 400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });

  animation.addEventListener('finish', () => done());
}

const formatter = Intl.DateTimeFormat(undefined, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
});
function formatDate(dateString?: Date | string) {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  return formatter.format(date);
}

async function copyShareLink() {
  if (!details.value?.shares) {
    return;
  }

  const { protocol, host } = window.location;
  const link = details.value?.shares.link;

  await navigator.clipboard.writeText(`${protocol}//${host}/view/${link}`);

  createToast('Copied share link');
}

const debouncedToggleShareLink = debounce(toggleShareLink, 250);
function toggleShareLink(isCreateRequest: boolean) {
  if (isLoadingItemDetails.value) {
    return;
  }

  isLoadingItemDetails.value = true;

  $fetch(`/api/share/note/${path}`, {
    method: isCreateRequest ? 'POST' : 'DELETE',
  })
    .then(() => refresh())
    .finally(() => isLoadingItemDetails.value = false);
}

useFocusTrap(itemDetailsEl);
useTinykeys({ Escape: unsetCurrentDetailsItem });
useClickOutside(itemDetailsEl, unsetCurrentDetailsItem);

onBeforeMount(() => refresh());
</script>

<template>
  <WithBackdrop class="item-details__wrapper fast-fade">
    <WorkspaceModal
      id="item-details"
      ref="itemDetailsComp"
      class="item-details"
      aria-labelledby="item-details-dialog-title"
    >
      <button class="item-details__close-button" @click="unsetCurrentDetailsItem">
        <LazyIconCloseRounded v-once class="item-details__close-button__icon" />
      </button>

      <WithFadeTransition appear @before-leave="rememberHeight" @enter="transitionHeight">
        <WorkspaceItemDetailsSkeleton v-if="!details" key="skeleton" />

        <div v-else key="content" class="item-details__data">
          <!-- TODO: split into smaller components -->
          <p
            id="item-details-dialog-title"
            class="item-details__data__title"
            :aria-label="`Details: ${details.name}`"
          >
            {{ details.name }}
          </p>

          <div v-if="!isFolder" class="item-details__data__row item-details__data__row--share">
            <p class="item-details__data__row__title">
              Note share
            </p>

            <hr class="item-details__data__row__hr">

            <button
              class="item-details__data__row__share-link"
              :disabled="!details.shares || isLoadingItemDetails"
              @click="copyShareLink"
            >
              <!-- NOTE: skeleton class adds appear delay -->
              <WithFadeTransition>
                <span v-if="isLoadingItemDetails" class="skeleton">Loading...</span>
                <span v-else-if="details.shares">{{ details.shares.link }}</span>
                <span v-else>Disabled</span>
              </WithFadeTransition>
            </button>

            <input
              :checked="!!details.shares"
              :readonly="isLoadingItemDetails"
              type="checkbox"
              class="item-details__data__row__checkbox"
              @input="debouncedToggleShareLink(!details?.shares)"
            >
          </div>

          <div v-for="(data, key) in rowsData" :key="key" class="item-details__data__row">
            <p class="item-details__data__row__title">
              {{ data.title }}
            </p>

            <hr class="item-details__data__row__hr">

            <WithFadeTransition>
              <p :key="data.value.value" class="item-details__data__row__value">
                {{ data.value.value }}
              </p>
            </WithFadeTransition>
          </div>
        </div>
      </WithFadeTransition>
    </WorkspaceModal>
  </WithBackdrop>
</template>

<style lang="scss">
.item-details {
  position: relative;
  z-index: 1;

  max-width: $breakpoint-tablet;

  padding: 2rem 1.25rem 1.5rem;

  @media (max-width: $breakpoint-tablet) {
    padding-block-start: 3rem;
  }

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: $breakpoint-tablet) {
      align-items: stretch;
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
