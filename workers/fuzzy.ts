// @ts-expect-error no types :(
import getScore from '@superhuman/command-score';
import { expose } from 'comlink';

import { SearchAction } from '~/types/common';

import type { SearchActionValues } from '~/types/common';

const itemsCache = new Map<string, FuzzyItem>();

// NOTE: command could be only one word,
// or use '-' as space replace
const commandsCache = new Map<SearchActionValues, CommandItem>([
  [SearchAction.New, { name: 'new', key: SearchAction.New }],
  [SearchAction.Refresh, { name: 'refresh', key: SearchAction.Refresh }],
  [SearchAction.RefreshNote, { name: 'refresh-note', key: SearchAction.RefreshNote }],
  [SearchAction.RefreshFolder, { name: 'refresh-folder', key: SearchAction.RefreshFolder }],
  [SearchAction.SaveNote, { name: 'save-note', key: SearchAction.SaveNote }],
]);

function addItem(item: FuzzyItem) {
  itemsCache.set(item.path, item);
}

function addItems(items: FuzzyItem[]) {
  for (const item of items)
    itemsCache.set(item.path, item);
}

function search(query: string, maxLength = 4): (FuzzyItem | CommandItem)[] {
  // See https://stackblitz.com/edit/node-ezlzug?file=index.js&view=editor and run `node index.js`
  // but in `real world`? fuzzaldrin was a bit slower plus had much more bigger bundle footprint

  const isCommand = query.startsWith('/');

  if (isCommand)
    query = (query.match(/\w+/) || [''])[0];

  const results = [];
  const cache = isCommand ? commandsCache : itemsCache;

  for (const [, value] of cache) {
    const score = getScore(value.name, query);

    if (score > 0)
      results.push({ score, value });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .map((suggestion) => suggestion.value)
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
