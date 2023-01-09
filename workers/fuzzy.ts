import { expose } from 'comlink';
import LRU from 'lru-cache';
// @ts-expect-error no types for command score :(
import commandScore from 'command-score';

import type { FolderOrNote } from '~/composables/store';

export type FuzzyItem = Pick<FolderOrNote, 'name' | 'path' | 'root'>;

// will store only item name, path and root for folder
const cache = new LRU<string, FuzzyItem>({ max: 100 });

function addItem(item: FuzzyItem) {
  cache.set(item.path, item);
}

function addItems(items: FuzzyItem[]) {
  for (const item of items)
    cache.set(item.path, item);
}

function search(query: string, maxLength = 4) {
  const results = [];

  console.log('searching with: ', query);

  // @ts-expect-error valList is not listed in interface but it is there!
  for (const item of cache.valList) {
    if (!item) continue;

    const score = commandScore((item.name), query);

    if (score > 0)
      results.push({ score, item });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .map((suggestion) => suggestion.item)
    .slice(0, maxLength);
}

async function populateCache() {
  const res = await fetch('/api/search/client');
  const items = await res.json() as FuzzyItem[];

  for (const item of items)
    cache.set(item.path, item);
}

expose({
  searchWithQuery: search,
  addItemToCache: addItem,
  addItemsToCache: addItems,
  testing: () => `hello from webworker: ${Math.random()}`,
});

populateCache();
