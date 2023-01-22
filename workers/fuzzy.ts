import { expose } from 'comlink';
// @ts-expect-error no types for command score :(
import commandScore from 'command-score';

import { SearchAction } from '~/types/common';

import type { SearchActionValues } from '~/types/common';

// will store only item name, path and root for folder
// const itemsCache = new LRU<string, FuzzyItem>({ max: 100 });
const itemsCache = new Map<string, FuzzyItem>();

// NOTE: command could be only one word,
// or use '-' as space replace
const commandsCache = new Map<SearchActionValues, string>([
  [SearchAction.New, 'new'],
  [SearchAction.Refresh, 'refresh'],
  [SearchAction.RefreshFolder, 'refresh-folder'],
]);

function addItem(item: FuzzyItem) {
  itemsCache.set(item.path, item);
}

function addItems(items: FuzzyItem[]) {
  for (const item of items)
    itemsCache.set(item.path, item);
}

function search(query: string, maxLength = 4): (FuzzyItem | CommandItem)[] {
  const results = [];

  if (query.startsWith('/')) {
    query = query.slice(1).trim().split(' ')[0];

    for (const [key, name] of commandsCache) {
      if (!name) continue;

      const score = commandScore(name, query);

      if (score > 0)
        results.push({ score, item: { name, key } });
    }
  }
  else {
    for (const [, item] of itemsCache) {
      if (!item) continue;

      const score = commandScore(item.name, query);

      if (score > 0)
        results.push({ score, item });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .map((suggestion) => suggestion.item)
    .slice(0, maxLength);
}

async function populateItemsCache() {
  const res = await fetch('/api/search/client');
  const items = await res.json() as FuzzyItem[];

  itemsCache.clear();

  addItems(items);
}

expose({
  searchWithQuery: search,
  addItemToCache: addItem,
  addItemsToCache: addItems,
  refreshItemsCache: populateItemsCache,
});

populateItemsCache();
