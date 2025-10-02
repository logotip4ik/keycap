/* eslint-disable perfectionist/sort-imports */
import type { Emoji, EmojiMartData } from '@emoji-mart/data';

import type { FuzzyWorker } from '~/utils/fuzzy';
import type { Replacement } from '~/utils/tiptap/extensions/replacements/replacements';

// must come before coincident
import '@ungap/with-resolvers';

// @ts-expect-error no types
import coincident from 'coincident/worker';

import { protectionHeaders } from '~~/shared/utils/utils';

import { fuzzyMatch } from '~/utils/fuzzy-match';

import { commandActionsMin } from '~/utils/menu';
import { replacementsMin } from '~/utils/tiptap/extensions/replacements/replacements';
import { transliterateFromEnglish, transliterateToEnglish } from '~/utils/transliterate';

const wordRE = /\w+/;
const arrayWithString = [''];
const itemsCache = new Map<string, FuzzyItem>();

let populateItemsCachePromise: Promise<void> | undefined;

const firstSlashPartRE = /\/\w+\//;
function addItem(item: FuzzyItem) {
  // truncate before first slash part /test/abc -> abc
  let identifier = decodeURIComponent(item.path.replace(firstSlashPartRE, ''));

  // it means user workspace. `/username` -> `/username`, so we should use generated name for it.
  if (identifier === item.path) {
    identifier = item.name;
  }

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

const firstFiveItemsFromCommandsCache = [...commandActionsMin.values()].slice(0, 5);
function search(query: string): Array<FuzzyItem | CommandItem> {
  // See https://stackblitz.com/edit/node-ezlzug?file=index.js&view=editor and run `node index.js`
  // but in `real world`? fuzzaldrin was a bit slower plus had much more bigger bundle footprint

  const isCommand = query[0] === '/';

  if (isCommand) {
    query = (query.match(wordRE) || arrayWithString)[0];

    if (query.length === 0) {
      return firstFiveItemsFromCommandsCache;
    }
  }

  const results = [];
  const cache = isCommand ? commandActionsMin : itemsCache;

  for (const [key, value] of cache) {
    const score = fuzzyMatch(query, isCommand ? value.name : key as string);

    if (score > 30) {
      results.push({ score, value });
    }
  }

  if (results.length === 0) {
    return results as any;
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
  const { promise, resolve } = Promise.withResolvers<void>();

  populateItemsCachePromise = promise;

  const res = await fetch('/api/search/client', {
    headers: {
      Accept: 'application/json',
      ...protectionHeaders,
    },
  });

  const { data } = res.ok ? await res.json() as { data?: Array<FuzzyItem> } : { data: undefined };

  itemsCache.clear();

  if (data && data.length > 0) {
    for (const item of data) {
      addItem(item);
    }
  }

  resolve();
  populateItemsCachePromise = undefined;
}

interface EmojiWithKey extends Emoji {
  key: string
}
const emojisCache = new Array<EmojiWithKey>();

async function populateEmojisCache() {
  const emojis = Object.values(
    (await import('@emoji-mart/data').then((m) => m.default as EmojiMartData)).emojis,
  );

  for (const emoji of emojis) {
    emojisCache.push({
      ...emoji,
      key: emoji.id,
    });
  }
}

async function searchForEmoji(query: string) {
  if (emojisCache.length === 0) {
    await populateEmojisCache();
  }

  const results = [];

  for (const value of emojisCache) {
    const score = fuzzyMatch(query, value.key);

    if (score > 30) {
      results.push({ score, value });
    }
  }

  if (results.length === 0) {
    return results as any;
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((suggestion) => suggestion.value);
}

populateItemsCache();

const firstFiveReplacements = [...replacementsMin.values()].slice(0, 5).map((item) => item.id);
function searchForReplacement(query: string): Array<Replacement> {
  const results = [];

  if (!query) {
    return firstFiveReplacements;
  }

  for (const value of replacementsMin) {
    const score = fuzzyMatch(query, value.id);

    if (score > 30) {
      results.push({ score, value });
    }
  }

  if (results.length === 0) {
    return results as any;
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((suggestion) => suggestion.value.id);
}

const fuzzyInterface: FuzzyWorker = {
  searchWithQuery: searchWithTransliteration,
  searchForEmoji,
  addItemToCache: addItem,
  hasItemInCache,
  refreshItemsCache: populateItemsCache,
  searchForReplacement,
};

// eslint-disable-next-line antfu/no-top-level-await
const { proxy: worker } = await coincident();

Object.assign(worker, fuzzyInterface);
