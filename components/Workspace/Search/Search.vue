<script setup lang="ts">
const props = defineProps<{
  onClose: () => void
}>();

const fuzzyWorker = useFuzzyWorker();

const results = shallowRef<Array<FuzzyItem | CommandItem>>([]);
const resultsEl = shallowRef<ComponentPublicInstance<HTMLUListElement> | null>(null);
const isLoadingResults = ref(false);
const selectedResult = ref(0);
const searchInput = ref('');
const isResultsEmpty = ref(false);
const typeaheadResult = computed<FuzzyItem | CommandItem | null>(() => results.value[selectedResult.value] || null);

const inputEl = shallowRef<HTMLElement | null>(null);
const searchEl = shallowRef<HTMLElement | null>(null);

defineExpose({ input: inputEl });

function closeWithDelay(_event?: Event) {
  setTimeout(() => {
    props.onClose();
  }, 0);
}

let afterSearchCallback: ((...args: Array<any>) => any) | null;
function handleSearchInput(value: string) {
  value = value.trim();
  selectedResult.value = 0;

  if (value.length < 1 || !fuzzyWorker.value)
    return results.value = [];

  isLoadingResults.value = true;

  fuzzyWorker.value.searchWithQuery(value)
    .then((entries: Array<FuzzyItem | CommandItem>) => {
      results.value = entries;

      afterSearchCallback && afterSearchCallback();
    })
    .finally(() => {
      isLoadingResults.value = false;

      afterSearchCallback = null;
    });
}

async function openItem() {
  const list = resultsEl.value?.$el as HTMLUListElement | undefined;
  const result = list?.children[selectedResult.value];

  if (!result) {
    if (!afterSearchCallback)
      afterSearchCallback = openItem;

    return;
  };

  const actionEl = result.firstElementChild as HTMLAnchorElement | HTMLButtonElement;
  const actionName = actionEl.dataset.name;

  actionEl.click();

  if (!actionName)
    return;

  const focusActionItem = (delay = 1): void => {
    setTimeout(() => {
      const item = document.querySelector(`.contents__list a[aria-label*="${actionName}"]`) as HTMLAnchorElement;

      if (!item)
        return focusActionItem(100);

      item.offsetParent?.scroll({
        top: item.offsetTop - 8,
        behavior: 'smooth', // the animation looks horrible in chrome
      });
    }, delay);
  };

  focusActionItem();
}

function changeSelectedResult(difference: number) {
  const newSelectedResult = (selectedResult.value + difference) % results.value.length;

  selectedResult.value = newSelectedResult < 0 ? results.value.length - 1 : newSelectedResult;
}

watch([searchInput, isLoadingResults, results], debounce(([value, isLoading, results]) => {
  if (!value || isLoading)
    return isResultsEmpty.value = false;

  isResultsEmpty.value = value.length !== 0 && results.length === 0;
}, 125));

watch(searchInput, debounce(handleSearchInput, 100));

let prevHeight: number;
let prevAnimation: Animation | null;
function rememberHeight() {
  if (searchEl.value)
    prevHeight = searchEl.value.clientHeight;
}

function animateHeight() {
  if (!searchEl.value)
    return;

  if (prevAnimation)
    prevAnimation.cancel();

  const currentHeight = searchEl.value.clientHeight;

  prevAnimation = searchEl.value.animate([
    { height: `${prevHeight}px` },
    { height: `${currentHeight}px` },
  ], { duration: 225, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });

  prevAnimation.addEventListener('finish', () => prevAnimation = null);
}

useFocusTrap(searchEl);
useTinykeys({ Escape: closeWithDelay });
</script>

<template>
  <div class="search-wrapper" @click.self="closeWithDelay">
    <div ref="searchEl" class="search">
      <form class="search__form" @submit.prevent="openItem">
        <!-- TODO: split into smaller components -->
        <WorkspaceSearchInput
          ref="inputEl"
          :value="searchInput"
          class="search__form__input"
          placeholder="Search or enter / for commands"
          @update-value="searchInput = $event"
          @keydown.up.prevent="changeSelectedResult(-1)"
          @keydown.down.prevent="changeSelectedResult(+1)"
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
          @click="closeWithDelay"
        >
          <LazyIconCloseRounded class="search__form__cancel__icon" />
        </button>
      </form>

      <Transition
        name="fade"
        @enter="animateHeight"
        @leave="animateHeight"
        @before-enter="rememberHeight"
        @before-leave="rememberHeight"
      >
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
          ref="resultsEl"
          tag="ul"
          name="list"
          class="search__results"
          @enter="animateHeight"
          @leave="animateHeight"
          @before-enter="rememberHeight"
          @before-leave="rememberHeight"
        >
          <li
            v-for="(item, idx) in results"
            :key="item.name + (item as FuzzyItem).path"
            class="search__results__item"
          >
            <WorkspaceSearchItem
              :item="item"
              :selected="selectedResult === idx"
              @focus="selectedResult = idx"
              @click="closeWithDelay"
            />
          </li>
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

  border: 1px solid hsla(var(--text-color-hsl), 0.2);
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

  @media (max-width: $breakpoint-tablet) {
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
      backdrop-filter: blur(8px);
    }

    @media (max-width: $breakpoint-tablet) {
      padding-top: 0;
    }
  }

  &__form {
    --search-font-size: 1.75rem;

    display: flex;
    align-items: center;

    position: relative;
    z-index: 1;

    margin: 0;
    padding: 0.75rem 1.25rem;

    border-radius: 0.25rem;
    border: 1px solid var(--task-list-indicator-color);

    &:is(:hover, :focus-within) {
      outline: none;
      border-color: var(--task-list-indicator-color);
    }

    @media (max-width: $breakpoint-tablet) {
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

      @media (max-width: $breakpoint-tablet) {
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

.search-fade-leave-active,
.search-fade-leave-active .search {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;

  .search {
    transform: scale(0.95);
  }
}

@media (width <= $breakpoint-tablet) {
  .search-fade-enter-active {
    transition: opacity 0.25s ease;
  }

  .search-fade-leave-active {
    transition-duration: 0s;
  }

  .search-fade-leave-to {
    .search {
      transform: none;
    }
  }
}
</style>
