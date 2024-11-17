<script setup lang="ts">
const props = defineProps<{
  item: NoteMinimal | FolderMinimal
}>();

const kfetch = useKFetch();
const createToast = useToaster();
const currentItemForDetails = useCurrentItemForDetails();
const user = useRequiredUser();

const details = shallowRef<ItemDetails>();
const itemDetailsComp = shallowRef<ComponentPublicInstance | null>(null);
const isLoadingItemDetails = ref(false);

const itemDetailsEl = computed(() => itemDetailsComp.value?.$el as HTMLElement | undefined);
const itemApiPath = computed(() => props.item.path.substring(1 + user.value.username.length));

const isFolder = checkIsFolder(props.item);

type ItemDetails = Prettify<ItemMetadata & {
  share?: { link: string }
}>;

const rowsData = [
  { title: 'Last update', value: computed(() => formatDate(details.value?.updatedAt)) },
  { title: 'Created at', value: computed(() => formatDate(details.value?.createdAt)) },
];

async function fetchDetails() {
  const res = await kfetch<{ data: ItemDetails }>(
    isFolder ? `/api/folder/${itemApiPath.value}` : `/api/note/${itemApiPath.value}`,
    { query: { details: true } },
  ).catch((error) => {
    sendError(error);
  });

  if (res) {
    details.value = res.data;
  }
  else {
    unsetCurrentDetailsItem();
    createToast(`Failed to fetch details for "${props.item.name}". Please try again later...`);
  }
}

function unsetCurrentDetailsItem() {
  // immediate unset of details will cause issues with transition
  // details.value = undefined;

  currentItemForDetails.value = undefined;
}

let prevPopupHeight: number | undefined;
function rememberHeight() {
  prevPopupHeight = itemDetailsEl.value?.clientHeight;
}

function transitionHeight(_el: Element, done: () => void) {
  const itemDetails = itemDetailsEl.value;

  if (!prevPopupHeight || !itemDetails) {
    return;
  }

  const newHeight = itemDetails.clientHeight;

  const heightDifference = Math.abs(prevPopupHeight - newHeight);

  if (heightDifference < 2) {
    done();
    return;
  }

  const animation = itemDetails.animate([
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
  if (!details.value?.share?.link) {
    return;
  }

  const { protocol, host } = window.location;
  const { link } = details.value?.share;

  try {
    await navigator.clipboard.writeText(`${protocol}//${host}/view/${link}`);

    createToast('Copied share link.');
  }
  catch {};
}

const debouncedToggleShareLink = debounce(toggleShareLink, 250);
function toggleShareLink(isCreateRequest: boolean) {
  if (isLoadingItemDetails.value) {
    return;
  }

  isLoadingItemDetails.value = true;

  kfetch(`/api/share/note/${itemApiPath.value}`, {
    method: isCreateRequest ? 'POST' : 'DELETE',
  })
    .then(() => fetchDetails())
    .finally(() => isLoadingItemDetails.value = false);
}

onBeforeMount(() => fetchDetails());
</script>

<template>
  <WithBackdrop class="item-details__wrapper fast-fade" @click.self="unsetCurrentDetailsItem">
    <WorkspaceModal
      id="item-details"
      ref="itemDetailsComp"
      class="item-details"
      aria-labelledby="item-details-dialog-title"
      @close="unsetCurrentDetailsItem"
    >
      <WorkspaceModalCloseButton @click="unsetCurrentDetailsItem" />

      <WithFadeTransition appear @before-leave="rememberHeight" @enter="transitionHeight">
        <WorkspaceItemDetailsSkeleton v-if="!details" key="skeleton" />

        <div v-else key="content" class="item-details__data">
          <!-- TODO: split into smaller components -->
          <p
            id="item-details-dialog-title"
            class="item-details__data__title"
            :aria-label="`Details: ${item.name}`"
          >
            {{ item.name }}
          </p>

          <div v-if="!isFolder" class="item-details__data__row item-details__data__row--share">
            <p class="item-details__data__row__title">
              Note share
            </p>

            <hr class="item-details__data__row__hr">

            <button
              class="item-details__data__row__share-link"
              :disabled="!details.share || isLoadingItemDetails"
              @click="copyShareLink"
            >
              <!-- NOTE: skeleton class adds appear delay -->
              <WithFadeTransition>
                <span v-if="isLoadingItemDetails" class="skeleton">Loading...</span>
                <span v-else-if="details.share">{{ details.share.link }}</span>
                <span v-else>Disabled</span>
              </WithFadeTransition>
            </button>

            <input
              :checked="!!details.share"
              :readonly="isLoadingItemDetails"
              type="checkbox"
              class="item-details__data__row__checkbox"
              @input="debouncedToggleShareLink(!details?.share)"
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

  overflow: hidden;

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
        --size: 1.65rem !important;
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
