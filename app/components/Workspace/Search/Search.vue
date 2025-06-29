<script setup lang="ts">
const props = defineProps<{
  onClose: () => void
}>();

const fuzzyWorker = getFuzzyWorker();
const user = useRequiredUser();

const results = shallowRef<Array<FuzzyItem | CommandItem>>([]);
const resultsState = ref<'idle' | 'empty'>('idle');

const selected = ref(0);
const selectedResult = computed<FuzzyItem | CommandItem | undefined>(() => results.value[selected.value]);

const searchInput = ref('');

const inputEl = useTemplateRef('inputEl');
const searchComp = useTemplateRef('searchComp');

defineExpose({ input: inputEl });

function handleSearchInput(value: string) {
  value = value.trimStart();

  searchInput.value = value;
  selected.value = 0;

  const worker = fuzzyWorker.value;

  if (value.length === 0 || !worker) {
    results.value = [];
    resultsState.value = 'idle';
    return;
  }

  worker.searchWithQuery(value).then((entries) => {
    results.value = entries;
    // if results are empty and user has cleared input, then display as idle
    // else, show results
    resultsState.value = entries.length === 0
      ? (value.length === 0 ? 'idle' : 'empty')
      : 'idle';
  });
}

async function openItem() {
  const result = selectedResult.value;

  if (!result) {
    return;
  }

  // is command
  if ('key' in result) {
    const action = commandActions[result.key];

    const search = searchInput.value;
    const whitespaceIdx = search.indexOf(' ');
    const arg = whitespaceIdx === -1 ? undefined : search.substring(whitespaceIdx + 1);

    await action?.(arg);
  }
  else {
    await navigateTo(
      generateItemPath(result),
    );
  }

  props.onClose();
}

function changeSelectedResult(difference: number) {
  const newSelectedResult = (selected.value + difference) % results.value.length;

  selected.value = newSelectedResult < 0 ? results.value.length - 1 : newSelectedResult;
}

function fillResult() {
  const result = selectedResult.value;

  if (!result) {
    return;
  }

  if ('key' in result) {
    searchInput.value = `/${result.name} `;
  }
  else {
    const itemPath = generateSearchRelativeItemPath(result.path, user.value.username);
    if (itemPath) {
      searchInput.value = `${itemPath}/${result.name}`;
    }
    else {
      searchInput.value = result.name;
    }
  }
}

useTinykeys({
  'Control+n': (e) => {
    e.preventDefault();
    changeSelectedResult(+1);
  },
  'Control+p': (e) => {
    e.preventDefault();
    changeSelectedResult(-1);
  },
});
</script>

<template>
  <WithBackdrop class="search__wrapper" @click.self="onClose">
    <WorkspaceModal id="search-modal" ref="searchComp" class="search" @close="onClose">
      <form class="search__form" @submit.prevent="openItem">
        <WorkspaceSearchInput
          ref="inputEl"
          :value="searchInput"
          class="search__form__input"
          placeholder="Search or enter / for commands"
          @update-value="handleSearchInput"
          @keydown.enter.prevent="openItem"
          @keydown.up.prevent="changeSelectedResult(-1)"
          @keydown.down.prevent="changeSelectedResult(+1)"
          @keydown.tab.prevent="fillResult"
        />

        <p v-show="selectedResult" class="search__form__typeahead">
          <span class="search__form__typeahead__input-clone">{{ searchInput }}</span>
          <span class="search__form__typeahead__result">&nbsp;-
            <template v-if="selectedResult?.name.toLowerCase() !== searchInput.toLowerCase()">
              {{ selectedResult?.name }}
            </template>
            <template v-else>
              open
            </template>
          </span>
        </p>

        <button
          type="reset"
          class="search__form__cancel"
          @click="props.onClose"
        >
          <Icon name="close-rounded" class="search__form__cancel__icon" />
        </button>
      </form>

      <WorkspaceSearchList
        :state="resultsState"
        :animate-el="searchComp?.$el"
      >
        <li
          v-for="(item, idx) in results"
          :key="item.name + (item as FuzzyItem).path"
          class="search__results__item"
        >
          <WorkspaceSearchItem
            :item="item"
            :selected="selected === idx"
            @focus="selected = idx"
            @click.passive="props.onClose"
          />
        </li>
      </WorkspaceSearchList>
    </WorkspaceModal>
  </WithBackdrop>
</template>

<style lang="scss">
.search {
  max-width: 575px;
  overflow: hidden;

  margin: 0 auto;
  padding: 0.5rem;

  @media (max-width: $breakpoint-tablet) {
    padding: 1.5rem;
    max-width: unset;
  }

  &__wrapper {
    padding-top: 33vh;

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

      /* vue isn't as fast as browser, so hiding typeahead if input is empty */
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
</style>
