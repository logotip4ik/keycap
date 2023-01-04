<script setup lang="ts">
import { AsyncFzf as FuzzySearch } from 'fzf';

import type { AsyncFzf } from 'fzf';
import type { CommandItem, FolderOrNote, FolderWithContents } from '~/composables/store';

interface Emits { (e: 'close'): void }
const emit = defineEmits<Emits>();

// NOTE: command could be only one word,
// or use '-' as space replace
const commands: CommandItem[] = [
  { name: 'refresh', action: () => refreshNuxtData('note') },
  { name: 'refresh-folder', action: () => refreshNuxtData('folder') },
  {
    name: 'new',
    action: (args) => {
      const nuxtApp = useNuxtApp();

      preCreateItem(nuxtApp.payload.data.folder, { name: args?.join(' ') || '' });
    },
  },
];

const foldersCache = useFoldersCache();

const results = ref<FolderOrNote[] | CommandItem[]>([]);
const isLoadingResults = ref(false);
const selectedResult = ref(0);
const typeaheadResult = computed<FolderOrNote | CommandItem | null>(() => results.value[selectedResult.value] || null);

const inputEl = ref<HTMLElement | null>(null);
const searchEl = ref<HTMLElement | null>(null);

const searchInput = ref('');
const debouncedSearchInput = useDebounce(searchInput, 150);

let itemsFzf: AsyncFzf<FolderOrNote[]>;
let commandsFzf: AsyncFzf<CommandItem[]>;

defineExpose({ input: inputEl });

function searchCommandWithName(name: string) {
  isLoadingResults.value = true;

  commandsFzf.find(name)
    .then((entries) => {
      results.value = entries.map((entry) => entry.item);
    })
    .finally(() => {
      isLoadingResults.value = false;
    });
}

function searchItemWithName(name: string) {
  isLoadingResults.value = true;

  itemsFzf.find(name)
    .then((entries) => {
      results.value = entries.map((entry) => entry.item);
    })
    .finally(() => {
      isLoadingResults.value = false;
    });
}

function handleCancel(_event?: Event) {
  emit('close');

  searchInput.value = '';
  selectedResult.value = 0;
}

function defineFuzzySearch() {
  return new Promise<void>((resolve) => {
    let theMostUpperFolder: FolderWithContents | undefined;

    for (const folder of foldersCache.values()) {
      if (!theMostUpperFolder) {
        theMostUpperFolder = folder;
        continue;
      }

      if (theMostUpperFolder && folder.path.length < theMostUpperFolder.path.length)
        theMostUpperFolder = folder;
    }

    const items = [theMostUpperFolder] as FolderOrNote[];

    const findAllItems = (item: FolderWithContents | undefined) => {
      if (!item) return;

      if (item.notes && item.notes.length !== 0)
        items.push(...item.notes as FolderOrNote[]);

      if (item.subfolders && item.subfolders.length !== 0) {
        items.push(...item.subfolders as FolderOrNote[]);

        for (const folder of item.subfolders)
          findAllItems(foldersCache.get(folder.path));
      }
    };

    findAllItems(theMostUpperFolder!);

    itemsFzf = new FuzzySearch(items, {
      fuzzy: 'v2',
      limit: 5,
      normalize: true,
      selector: (item) => item.name,
    });

    commandsFzf = new FuzzySearch(commands, {
      fuzzy: 'v2',
      limit: 5,
      normalize: true,
      selector: (item) => item.name,
    });

    resolve();
  });
}

function handleSearchInput(value: string) {
  value = value.trim();
  selectedResult.value = 0;

  if (value.length < 2)
    return results.value = [];

  const isCommand = value.startsWith('/');

  if (isCommand) {
    const args = value.slice(1).split(' ');

    const commandName = args[0];

    searchCommandWithName(commandName);
  }
  else {
    searchItemWithName(value);
  }
}

async function openResult() {
  const resultToOpen = results.value[selectedResult.value];

  if (!resultToOpen) return;

  const isCommand = typeof (resultToOpen as CommandItem).action === 'function';

  if (isCommand) {
    const args = searchInput.value.slice(1).split(' ').slice(1);

    await (resultToOpen as CommandItem).action(args);
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

const isResultsEmpty = computed(() => {
  // slicing '/' for command
  const inputValue = debouncedSearchInput.value.startsWith('/') ? debouncedSearchInput.value.slice(1) : debouncedSearchInput.value;

  return results.value.length === 0 && inputValue.length !== 0;
});

watch(debouncedSearchInput, handleSearchInput);

let prevHeight = 0;
watch(results, async (results) => {
  if (!prevHeight)
    return setTimeout(() => prevHeight = searchEl.value?.offsetHeight || 0, 25);

  requestAnimationFrame(() => { // guaranties that element has its finished height
    if (!searchEl.value) return;

    const wantedHeight = searchEl.value.scrollHeight;

    if (prevHeight === wantedHeight) return;

    const guessedBaseHeight = 78;

    searchEl.value.animate([
      { height: `${prevHeight || guessedBaseHeight}px` },
      { height: `${wantedHeight}px` },
    ], { duration: 250, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });

    prevHeight = wantedHeight;
  });
}, { immediate: true });

onMounted(() => {
  defineFuzzySearch();
});

useTinykeys({ Escape: handleCancel });
</script>

<template>
  <div class="search-wrapper" @click.self="handleCancel">
    <div ref="searchEl" class="search">
      <form class="search__form" @submit.prevent="openResult">
        <input
          id="workspace-search-input"
          ref="inputEl"
          v-model="searchInput"
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
          @keydown.up.prevent="changeSelectedResult(-1)"
          @keydown.down.prevent="changeSelectedResult(+1)"
        >

        <p v-show="typeaheadResult" class="search__form__typeahead">
          <span class="search__form__typeahead__input-clone">{{ searchInput }}</span>
          <span class="search__form__typeahead__result"> -
            <template v-if="typeaheadResult?.name !== searchInput">
              {{ typeaheadResult?.name }}
            </template>
            <template v-else>
              open
            </template>
          </span>
        </p>
      </form>

      <Transition name="list">
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

  overflow: hidden;

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
    --search-font-size: 1.75rem;

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

      // vue isn't as fast as browser, so hiding typeahead if input is empty
      &:placeholder-shown + .search__form__typeahead {
        opacity: 0;
      }
    }

    &__typeahead {
      display: block;

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
