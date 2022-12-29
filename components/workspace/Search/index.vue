<script setup lang="ts">
import { AsyncFzf as FuzzySearch } from 'fzf';

import type { AsyncFzf } from 'fzf';
import type { FolderOrNote, FolderWithContents } from '~/composables/store';

interface Emits { (e: 'close'): void }
const emit = defineEmits<Emits>();

const user = useUser();
const foldersCache = useFoldersCache();

const results = ref<FolderOrNote[]>([]);
const isLoadingResults = ref(false);
const input = ref<HTMLElement | null>(null);
const searchInput = ref('');
const debouncedSearchInput = useDebounce(searchInput, 200);
let fzf: AsyncFzf<FolderOrNote[]>;

defineExpose({ input });

function searchItemWithName(name: string) {
  isLoadingResults.value = true;

  fzf.find(name)
    .then((entries) => {
      results.value = entries.map((entry) => entry.item);
    }).finally(() => {
      isLoadingResults.value = false;
    });
}

function handleCancel(event: Event) {
  emit('close');

  searchInput.value = '';
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

    fzf = new FuzzySearch(items, {
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

  if (value.length < 2)
    return results.value = [];

  const isCommand = value.startsWith('/');

  if (isCommand) {
    // TODO: add commands
  }
  else {
    searchItemWithName(value);
  }
}

watch(debouncedSearchInput, handleSearchInput);

onMounted(() => {
  input.value?.focus();
});

onBeforeMount(() => {
  defineFuzzySearch();
});

useTinykeys({ Escape: handleCancel });
</script>

<template>
  <div class="search-wrapper" @click.self="handleCancel">
    <div class="search">
      <form class="search__form" @submit.prevent="handleSearchInput(searchInput)">
        <input
          id="workspace-search-input"
          ref="input"
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
        >
      </form>

      <div v-if="results.length === 0 && debouncedSearchInput.length !== 0" class="search__no-results">
        <p>Nothing found...</p>
      </div>

      <TransitionGroup
        v-else-if="results.length !== 0"
        tag="ul"
        name="list"
        class="search__results"
      >
        <template v-for="item in results" :key="item.path">
          <li class="search__results__item">
            <WorkspaceSearchItem :item="item" @click="handleCancel" />
          </li>
        </template>
      </TransitionGroup>
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
    &__input {
      font: inherit;
      font-size: 1.75rem;
      color: currentColor;

      width: 100%;

      padding: 0.75rem 1.25rem;

      border: 1px solid var(--loading-indicator-color);
      border-radius: 0.25rem;
      appearance: none;
      background-color: transparent;

      &:is(:hover, :focus-visible) {
        outline: none;
        border-color: var(--task-list-indicator-color);
      }
    }
  }

  &__results {
    --items-spacing: 0.25rem;

    margin: 0.5rem 0 calc(var(--items-spacing) * -1);
    padding: 0 0;

    list-style-type: none;

    overflow: hidden;

    &__item {
      margin-bottom: var(--items-spacing);
    }
  }
}
</style>
