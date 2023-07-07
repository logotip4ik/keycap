<script setup lang="ts">
import { withoutLeadingSlash } from 'ufo';

interface Props { onClose: () => void }
const props = defineProps<Props>();

const fuzzyWorker = useFuzzyWorker();

const results = shallowRef<(FuzzyItem | CommandItem)[]>([]);
const isLoadingResults = ref(false);
const selectedResult = ref(0);
const typeaheadResult = computed<FuzzyItem | CommandItem | null>(() => results.value[selectedResult.value] || null);

const inputEl = ref<HTMLElement | null>(null);
const searchEl = ref<HTMLElement | null>(null);

const searchInput = ref('');
const debouncedSearchInput = useDebounce(searchInput, 125);

defineExpose({ input: inputEl });

function handleCancel(_event?: Event) {
  props.onClose();

  searchInput.value = '';
  selectedResult.value = 0;
}

function handleSearchInput(value: string) {
  value = value.trim();
  selectedResult.value = 0;

  if (value.length < 1 || !fuzzyWorker.value)
    return results.value = [];

  isLoadingResults.value = true;

  fuzzyWorker.value.searchWithQuery(value)
    .then((entries: (FuzzyItem | CommandItem)[]) => {
      results.value = entries;
    })
    .finally(() => {
      isLoadingResults.value = false;
    });
}

async function openResult() {
  const resultToOpen = results.value[selectedResult.value];

  if (!resultToOpen) return;

  const isCommand = 'key' in resultToOpen;

  if (isCommand) {
    const args = searchInput.value.slice(1).split(' ').slice(1);

    const action = commandActions[(resultToOpen as CommandItem).key];

    if (action) await action(args);
  }
  else {
    await navigateTo(generateItemRouteParams(resultToOpen as FolderOrNote));
  }

  handleCancel();
}

function changeSelectedResult(difference: number) {
  const newSelectedResult = (selectedResult.value + difference) % results.value.length;

  selectedResult.value = newSelectedResult < 0 ? results.value.length - 1 : newSelectedResult;
}

function fillSearchInput() {
  if (typeaheadResult.value)
    searchInput.value = typeaheadResult.value.name;
}

const isResultsEmpty = computed(() => {
  if (!debouncedSearchInput.value || isLoadingResults.value)
    return false;

  const inputValue = withoutLeadingSlash(debouncedSearchInput.value);

  return inputValue && results.value.length === 0;
});

watch(debouncedSearchInput, handleSearchInput);

let prevHeight = 0;
let prevAnimation: Animation | null;
useResizeObserver(searchEl, (entries) => {
  const entry = entries[0];
  const borderBoxSize = entry.borderBoxSize![0];

  const currentHeight = borderBoxSize.blockSize;

  if (prevHeight && currentHeight && !prevAnimation) {
    prevAnimation = entry.target.animate(
      [
        { height: `${prevHeight}px` },
        { height: `${currentHeight}px` },
      ],
      { duration: 225, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },
    );

    prevAnimation.addEventListener('finish', () => prevAnimation = null);
  }

  prevHeight = currentHeight;
});

useTinykeys({ Escape: handleCancel });
</script>

<template>
  <div class="search-wrapper" @click.self="handleCancel">
    <div ref="searchEl" class="search">
      <form class="search__form" @submit.prevent="openResult">
        <WorkspaceSearchInput
          ref="inputEl"
          :value="searchInput"
          class="search__form__input"
          placeholder="Search or enter / for commands"
          @update-value="searchInput = $event"
          @keydown.up.prevent="changeSelectedResult(-1)"
          @keydown.down.prevent="changeSelectedResult(+1)"
          @keydown.tab.prevent="fillSearchInput"
        />

        <p v-show="typeaheadResult" class="search__form__typeahead">
          <span class="search__form__typeahead__input-clone">{{ searchInput }}</span>
          <span class="search__form__typeahead__result">&nbsp;-
            <template v-if="typeaheadResult?.name.toLowerCase() !== searchInput.toLowerCase()">
              {{ typeaheadResult?.name }}
            </template>
            <template v-else>
              open
            </template>
          </span>
        </p>

        <button
          type="reset"
          class="search__form__cancel"
          @click="handleCancel"
        >
          <Icon name="close" class="search__form__cancel__icon" />
        </button>
      </form>

      <Transition name="fade">
        <div
          v-if="isResultsEmpty"
          class="search__no-results"
        >
          <p class="search__no-results__text">
            Nothing found...
          </p>
        </div>

        <TransitionGroup
          v-else-if="results.length !== 0"
          tag="ul"
          name="list"
          class="search__results"
        >
          <template v-for="(item, idx) in results" :key="`${item.name}-${item.path}`">
            <li class="search__results__item">
              <WorkspaceSearchItem
                :item="item"
                :selected="selectedResult === idx"
                @click="handleCancel"
                @focus="selectedResult = idx"
              />
            </li>
          </template>
        </TransitionGroup>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.search {
  width: 90%;
  max-width: 575px;

  margin: 0 auto;
  padding: 0.5rem;

  border: 1px solid hsla(var(--text-color-hsl), 0.125);
  border-radius: 0.5rem;
  background-color: var(--surface-color);
  box-shadow:
      1.3px 2.7px 5.3px rgba(0, 0, 0, 0.02),
      4.5px 8.9px 17.9px rgba(0, 0, 0, 0.03),
      20px 40px 80px rgba(0, 0, 0, 0.05);

  overflow: hidden;

  @supports (backdrop-filter: blur(1px)) {
    backdrop-filter: blur(5px);
    background-color: hsla(var(--surface-color-hsl), 0.5);
  }

  @media screen and (max-width: $breakpoint-tablet) {
    width: 100%;
    max-width: unset;

    height: 100%;

    border-radius: 0;
    padding:  1.5rem;
  }

  &-wrapper {
    position: fixed;
    inset:0;
    z-index: 10;

    padding-top: 33vh;

    background-color: hsla(var(--surface-color-hsl), 0.9);

    @supports (backdrop-filter: blur(1px)) {
      background-color: hsla(var(--surface-color-hsl), 0.25);
      backdrop-filter: blur(0.5rem);
    }

    @media screen and (max-width: $breakpoint-tablet) {
      padding-top: 0;
    }
  }

  &__form {
    --search-font-size: 1.75rem;

    display: flex;
    align-items: center;

    position: relative;
    isolation: isolate;
    z-index: 1;

    margin: 0;
    padding: 0.75rem 1.25rem;

    border-radius: 0.25rem;
    border: 1px solid var(--loading-indicator-color);

    &:is(:hover, :focus-within) {
      outline: none;
      border-color: var(--task-list-indicator-color);
    }

    @media screen and (max-width: $breakpoint-tablet) {
      --search-font-size: 1.1rem;
    }

    &__input {
      display: block;

      font: inherit;
      font-size: var(--search-font-size);
      color: currentColor;
      line-height: 1.5;

      width: 100%;

      margin: 0;
      padding: 0;

      border: 0;
      box-shadow: none;
      appearance: none;
      outline: none;
      background-color: transparent;

      &::-webkit-search-cancel-button {
        display: none;
      }

      // vue isn't as fast as browser, so hiding typeahead if input is empty
      &:placeholder-shown + .search__form__typeahead {
        opacity: 0;
      }
    }

    &__typeahead {
      display: flex;
      align-items: center;

      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      font: inherit;
      font-size: var(--search-font-size);
      color: currentColor;
      line-height: 1.5;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: hsl(var(--hsl-primary-color), 50%, 25%);

      padding: inherit;
      margin: 0;

      opacity: 0.5;
      pointer-events: none;
      overflow: hidden;

      &__input-clone {
        opacity: 0;
      }

      @media (prefers-color-scheme: dark) {
        color: hsl(var(--hsl-primary-color), 25%, 55%);
      }
    }

    &__cancel {
      display: none;
      justify-content: center;
      align-items: center;

      font-size: 2rem;
      color: hsla(var(--text-color-hsl), 0.7);

      margin-left: 0.5rem;
      margin-right: -0.5rem;

      border: none;
      border-radius: 0;
      appearance: none;
      background-color: transparent;

      &__icon {
        vertical-align: baseline !important;
      }

      @media screen and (max-width: $breakpoint-tablet) {
        display: inline-flex;
      }
    }
  }

  &__results {
    --items-spacing: 0.33rem;

    margin: 0.5rem 0 calc(var(--items-spacing) * -1);
    padding: 0 0;

    list-style-type: none;

    overflow: hidden;

    &__item {
      margin-bottom: var(--items-spacing);
    }
  }

  &__no-results {
    text-align: center;

    padding: 1.25rem 1.25rem 0.5rem;

    &__text {
      font-size: 1.5rem;

      opacity: 0.75;
    }
  }
}
</style>
