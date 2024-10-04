import type { Emoji } from '@emoji-mart/data';
import type { Remote } from 'comlink';
import type { ShallowRef } from 'vue';

import proxy from 'unenv/runtime/mock/proxy';

export interface FuzzyWorker {
  searchWithQuery: (query: string) => Promise<Array<FuzzyItem | CommandItem>>
  searchForEmoji: (query: string) => Promise<Array<Emoji>>
  addItemToCache: (item: FuzzyItem) => void
  hasItemInCache: (itemKey: string) => Promise<boolean>
  refreshItemsCache: () => Promise<void>
}

const fuzzyWorker: ShallowRef<Remote<FuzzyWorker> | undefined> = import.meta.server ? proxy : /* #__PURE__ */ shallowRef();

export function getFuzzyWorker(): typeof fuzzyWorker {
  return fuzzyWorker;
}

export async function defineFuzzyWorker() {
  if (fuzzyWorker.value) {
    return;
  }

  const fallbackWorker = new Worker(new URL('../workers/async-coincidence-fallback.ts', import.meta.url));
  const fallbackValueObject = { value: undefined as Promise<void> | undefined };
  const fallbackAsyncWait = <T>(buffer: T) => {
    fallbackValueObject.value = new Promise((onmessage) => {
      fallbackWorker.onmessage = () => onmessage();
      fallbackWorker.postMessage(buffer);
    });

    return fallbackValueObject;
  };

  // https://vitejs.dev/guide/features.html#web-workers
  const worker = new Worker(new URL('../workers/fuzzy.ts', import.meta.url), { type: 'module' });

  // Worker is broken in dev because it relies on SharedArrayBuffer, which is only available for
  // cross origin isolated sites, which localhost is not. But even if i set appropriate headers
  // for isolation, then workers will not be available on localhost
  if (import.meta.prod) {
    const coincident = await import('coincident').then((m) => m.default);

    fuzzyWorker.value = coincident(
      worker,
      // @ts-expect-error patched version without types
      { fallbackAsyncWait },
    ) as Remote<FuzzyWorker>;
  }
  else {
    const { wrap: comlink } = await import('comlink');

    fuzzyWorker.value = comlink(worker) as Remote<FuzzyWorker>;
  }
}
