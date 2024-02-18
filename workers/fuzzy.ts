import coincident from 'coincident';
import { expose } from 'comlink';
import { commandScore as getScore } from '@superhuman/command-score';

import { commandActionsMin as commandsCache } from '~/utils/menu';
import { transliterateFromEnglish, transliterateToEnglish } from '~/utils/transliterate';

const DEFAULT_RESULTS_COUNT = 5;
const itemsCache = new Map<string, FuzzyItem>();

function addItem(item: FuzzyItem) {
  // truncate before first slash part /test/abc -> abc
  const identifier = decodeURIComponent(item.path.replace(/\/\w+\//, ''));

  itemsCache.set(identifier, item);
}

const arrayWithString = [''];
function search(query: string, resultsCount = DEFAULT_RESULTS_COUNT): Array<FuzzyItem | CommandItem> {
  // See https://stackblitz.com/edit/node-ezlzug?file=index.js&view=editor and run `node index.js`
  // but in `real world`? fuzzaldrin was a bit slower plus had much more bigger bundle footprint

  const isCommand = query[0] === '/';

  if (isCommand)
    query = (query.match(/\w+/) || arrayWithString)[0];

  const results = [];
  const cache = isCommand ? commandsCache : itemsCache;

  for (const [key, value] of cache) {
    const score = getScore(isCommand ? value.name : key as string, query);

    if (score > 0)
      results.push({ score, value });
  }

  if (results.length === 0)
    return [];

  return results
    .sort((a, b) => b.score - a.score)
    .map((suggestion) => suggestion.value)
    .slice(0, resultsCount);
}

function searchWithTransliteration(query: string, resultsCount = DEFAULT_RESULTS_COUNT): Array<FuzzyItem | CommandItem> {
  let result = search(query, resultsCount);

  if (result.length === 0) {
    const transliterator = (query.codePointAt(0) || 0) > 127 ? transliterateToEnglish : transliterateFromEnglish;

    result = search(transliterator(query), resultsCount);
  }

  return result;
}

async function populateItemsCache() {
  const res = await fetch('/api/search/client');
  const items = res.ok ? await res.json() as { data?: Array<FuzzyItem> } : {};

  itemsCache.clear();

  for (const item of items.data || [])
    addItem(item);
}

populateItemsCache();

const fuzzyInterface: FuzzyWorker = {
  searchWithQuery: searchWithTransliteration,
  addItemToCache: addItem,
  refreshItemsCache: populateItemsCache,
};

if (import.meta.prod) {
  const worker = coincident(globalThis);

  Object.assign(worker, fuzzyInterface);
}
else {
  expose(fuzzyInterface);
}
