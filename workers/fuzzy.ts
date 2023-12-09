/// <reference path="../types/store.d.ts" />

import getScore from '@superhuman/command-score';
import coincident from 'coincident';

import { transliterateFromEnglish, transliterateToEnglish } from '~/utils/transliterate';
import { commandActionsMin as commandsCache } from '~/utils/menu';

const itemsCache = new Map<string, FuzzyItem>();

function addItem(item: FuzzyItem) {
  itemsCache.set(item.path, item);
}

function addItems(items: Array<FuzzyItem>) {
  for (const item of items)
    itemsCache.set(item.path, item);
}

function search(query: string, maxLength = 4): Array<FuzzyItem | CommandItem> {
  // See https://stackblitz.com/edit/node-ezlzug?file=index.js&view=editor and run `node index.js`
  // but in `real world`? fuzzaldrin was a bit slower plus had much more bigger bundle footprint

  const isCommand = query[0] === '/';

  if (isCommand)
    query = (query.match(/\w+/) || [''])[0];

  const results = [];
  const cache = isCommand ? commandsCache : itemsCache;

  for (const [, value] of cache) {
    const score = getScore(value.name, query);

    if (score > 0)
      results.push({ score, value });
  }

  if (results.length === 0)
    return [];

  return results
    .sort((a, b) => b.score - a.score)
    .map((suggestion) => suggestion.value)
    .slice(0, maxLength);
}

function searchWithTransliteration(query: string, maxLength = 4): Array<FuzzyItem | CommandItem> {
  let result = search(query, maxLength);

  if (result.length === 0) {
    const transliterator = query.charCodeAt(0) > 127 ? transliterateToEnglish : transliterateFromEnglish;

    result = search(transliterator(query), maxLength);
  }

  return result;
}

async function populateItemsCache() {
  const res = await fetch('/api/search/client');
  const items = res.ok ? await res.json() as { data?: Array<FuzzyItem> } : {};

  itemsCache.clear();

  addItems(items.data || []);
}

populateItemsCache();

const worker = coincident(globalThis);

Object.assign(worker, {
  searchWithQuery: searchWithTransliteration,
  addItemToCache: addItem,
  addItemsToCache: addItems,
  refreshItemsCache: populateItemsCache,
});

if (import.meta.hot)
  import.meta.hot.accept();
