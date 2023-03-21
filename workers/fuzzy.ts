// @ts-expect-error no types :(
import getScore from '@superhuman/command-score';
import { expose } from 'comlink';
import slug from 'slug';

import { commandActionsMin as commandsCache } from '~/utils/menu';

const itemsCache = new Map<string, FuzzyItem>();

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
  const searchWithCache = (q: string, c: Map<any, any>) => {
    const results = [];

    for (const [, value] of c) {
      const score = getScore(value.name, q);

      if (score > 0)
        results.push({ score, value });
    }

    return results;
  };

  if (isCommand)
    query = (query.match(/\w+/) || [''])[0];

  let results = searchWithCache(query, isCommand ? commandsCache : itemsCache);

  if (results.length === 0 && !isCommand) {
    query = slug(query);
    results = searchWithCache(query, itemsCache);
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
