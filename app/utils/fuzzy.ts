import type { Emoji } from '@emoji-mart/data';
import type { ShallowRef } from 'vue';

import proxy from 'unenv/runtime/mock/proxy';

import FuzzyWorkerUrl from '~/workers/fuzzy?worker&url';

export interface FuzzyWorker {
  searchWithQuery: (query: string) => Promise<Array<FuzzyItem | CommandItem>>
  searchForEmoji: (query: string) => Promise<Array<Emoji>>
  addItemToCache: (item: FuzzyItem) => void
  hasItemInCache: (itemKey: string) => Promise<boolean>
  refreshItemsCache: () => Promise<void>
}

type Promisify<T> = T extends Promise<unknown> ? T : Promise<T>;
type RemoteFunction<T> = T extends (...args: infer TArguments) => infer TReturn
  ? (
      ...args: { [I in keyof TArguments]: TArguments[I] }
    ) => Promisify<TReturn>
  : unknown;
type RemoteObject<T> = { [P in keyof T]: RemoteFunction<T[P]> };

const fuzzyWorker: ShallowRef<Prettify<RemoteObject<FuzzyWorker>> | undefined> = import.meta.server ? proxy : /* #__PURE__ */ shallowRef();

export function getFuzzyWorker(): typeof fuzzyWorker {
  return fuzzyWorker;
}

export async function defineFuzzyWorker() {
  if (import.meta.server || fuzzyWorker.value) {
    return;
  }

  // @ts-expect-error no types
  const coincident = await import('coincident/main').then((m) => m.default);
  const { Worker } = coincident();

  // https://vitejs.dev/guide/features.html#web-workers
  const worker = new Worker(FuzzyWorkerUrl, { type: 'module' });

  // fuzzy worker will be broken till nitro sends headers from route rules in dev mode
  // https://github.com/unjs/nitro/issues/2749
  fuzzyWorker.value = worker.proxy;
}
