import type { Emoji, EmojiMartData } from '@emoji-mart/data';

import { commandScore as getScore } from '@superhuman/command-score';

// @ts-expect-error no types
import coincident from 'coincident/worker';

import type { FuzzyWorker } from '~/utils/fuzzy';

import { commandActionsMin as commandsCache } from '~/utils/menu';
import { transliterateFromEnglish, transliterateToEnglish } from '~/utils/transliterate';

const wordRE = /\w+/;
const arrayWithString = [''];
const itemsCache = new Map<string, FuzzyItem>();
const emojisCache = new Map<string, Emoji>();

let populateItemsCachePromise: Promise<void> | undefined;

function addItem(item: FuzzyItem) {
  // truncate before first slash part /test/abc -> abc
  const identifier = decodeURIComponent(item.path.replace(/\/\w+\//, ''));

  itemsCache.set(identifier, item);
}

async function hasItemInCache(key: string) {
  if (populateItemsCachePromise) {
    await populateItemsCachePromise;
  }

  for (const item of itemsCache.values()) {
    if (item.path === key) {
      return true;
    }
  }

  return false;
}

function search(query: string): Array<FuzzyItem | CommandItem> {
  // See https://stackblitz.com/edit/node-ezlzug?file=index.js&view=editor and run `node index.js`
  // but in `real world`? fuzzaldrin was a bit slower plus had much more bigger bundle footprint

  const isCommand = query[0] === '/';

  if (isCommand) {
    query = (query.match(wordRE) || arrayWithString)[0];
  }

  const results = [];
  const cache = isCommand ? commandsCache : itemsCache;

  for (const [key, value] of cache) {
    const score = getScore(isCommand ? value.name : key as string, query);

    if (score > 0) {
      results.push({ score, value });
    }
  }

  if (results.length === 0) {
    return [];
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((suggestion) => suggestion.value);
}

async function searchWithTransliteration(query: string): Promise<Array<FuzzyItem | CommandItem>> {
  if (populateItemsCachePromise) {
    await populateItemsCachePromise;
  }

  let result = search(query);

  if (result.length === 0) {
    const transliterator = (query.codePointAt(0) || 0) > 127 ? transliterateToEnglish : transliterateFromEnglish;

    result = search(transliterator(query));
  }

  return result;
}

async function populateItemsCache() {
  let resolve: () => void;

  populateItemsCachePromise = new Promise((r) => {
    resolve = r;
  });

  const res = await fetch('/api/search/client');

  const { data } = res.ok ? await res.json() as { data?: Array<FuzzyItem> } : { data: undefined };

  itemsCache.clear();

  if (data && data.length > 0) {
    for (const item of data) {
      addItem(item);
    }
  }

  // @ts-expect-error this should work, because promise callback is executed synchronously
  resolve();
  populateItemsCachePromise = undefined;
}

async function populateEmojisCache() {
  const emojis = Object.values(
    (await import('@emoji-mart/data').then((m) => m.default as EmojiMartData)).emojis,
  );

  for (const emoji of emojis) {
    emojisCache.set(
      `${emoji.id} ${emoji.keywords.join(' ')}`,
      emoji,
    );
  }
}

async function searchForEmoji(query: string) {
  if (emojisCache.size === 0) {
    await populateEmojisCache();
  }

  const results = [];

  for (const [key, value] of emojisCache) {
    const score = getScore(key, query);

    if (score > 0) {
      results.push({ score, value });
    }
  }

  if (results.length === 0) {
    return [];
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((suggestion) => suggestion.value);
}

populateItemsCache();

const fuzzyInterface: FuzzyWorker = {
  searchWithQuery: searchWithTransliteration,
  searchForEmoji,
  addItemToCache: addItem,
  hasItemInCache,
  refreshItemsCache: populateItemsCache,
};

// eslint-disable-next-line antfu/no-top-level-await
const { proxy: worker } = await coincident();

Object.assign(worker, fuzzyInterface);
